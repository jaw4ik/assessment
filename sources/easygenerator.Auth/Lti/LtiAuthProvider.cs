using easygenerator.Auth.Providers;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using LtiLibrary.Core.Common;
using LtiLibrary.Core.OAuth;
using LtiLibrary.Owin.Security.Lti.Provider;
using System;
using System.Threading.Tasks;
using easygenerator.DomainModel.Events.UserEvents;

namespace easygenerator.Auth.Lti
{
    public class LtiAuthProvider : LtiAuthenticationProvider
    {
        private readonly IConsumerToolRepository _consumerToolRepository;
        private readonly ITokenProvider _tokenProvider;
        private readonly IUserRepository _userRepository;
        private readonly IEntityFactory _entityFactory;
        private readonly IDomainEventPublisher _eventPublisher;
        private readonly IReleaseNoteFileReader _releaseNoteFileReader;
        private readonly IUnitOfWork _unitOfWork;

        public LtiAuthProvider(IConsumerToolRepository consumerToolRepository, ITokenProvider tokenProvider, IUserRepository userRepository,
            IEntityFactory entityFactory, IDomainEventPublisher eventPublisher, IReleaseNoteFileReader releaseNoteFileReader, IUnitOfWork unitOfWork)
        {
            _consumerToolRepository = consumerToolRepository;
            _tokenProvider = tokenProvider;
            _userRepository = userRepository;
            _entityFactory = entityFactory;
            _eventPublisher = eventPublisher;
            _releaseNoteFileReader = releaseNoteFileReader;
            _unitOfWork = unitOfWork;

            const string consumerToolKey = "consumerToolKey";

            OnAuthenticate = context =>
            {
                var timeout = TimeSpan.FromMinutes(5);
                var oauthTimestampAbsolute = OAuthConstants.Epoch.AddSeconds(context.LtiRequest.Timestamp);
                if (DateTimeWrapper.Now().ToUniversalTime() - oauthTimestampAbsolute > timeout)
                {
                    throw new LtiException("Expired " + OAuthConstants.TimestampParameter);
                }

                var consumerTool = _consumerToolRepository.GetByKey(context.LtiRequest.ConsumerKey);
                if (consumerTool == null)
                {
                    throw new LtiException("Invalid " + OAuthConstants.ConsumerKeyParameter);
                }

                context.Request.Set(consumerToolKey, consumerTool);

                var consumerSignature = context.LtiRequest.GenerateSignature(consumerTool.Secret);
                if (!consumerSignature.Equals(context.LtiRequest.Signature))
                {
                    throw new LtiException("Invalid " + OAuthConstants.SignatureParameter);
                }

                return Task.FromResult<object>(null);
            };

            OnAuthenticated = context =>
            {
                var consumerTool = context.Request.Get<ConsumerTool>(consumerToolKey);
                if (consumerTool == null)
                {
                    throw new LtiException("Cannot get consumer tool from the context.");
                }

                var userEmail = context.LtiRequest.LisPersonEmailPrimary;
                if (string.IsNullOrWhiteSpace(context.LtiRequest.LisPersonEmailPrimary))
                {
                    throw new LtiException("Invalid LisPersonEmailPrimary: Email of the user is null or white space.");
                }

                var user = _userRepository.GetUserByEmail(userEmail);
                var ltiProviderUrl = context.LtiRequest.Parameters[Constants.ToolProviderUrl] ??
                                 context.Request.Uri.GetLeftPart(UriPartial.Authority);

                if (user == null)
                {
                    CreateNewUser(userEmail, context.LtiRequest.LisPersonNameGiven,
                        context.LtiRequest.LisPersonNameFamily, context.LtiRequest.UserId, consumerTool);

                }
                else
                {
                    if (user.IsLtiUser())
                    {
                        var userInfo = user.GetLtiUserInfo(consumerTool);
                        if (userInfo == null)
                        {
                            user.AddLtiUserInfo(context.LtiRequest.UserId, consumerTool);
                            _unitOfWork.Save();
                        }
                        else if (userInfo.LtiUserId != context.LtiRequest.UserId)
                        {
                            return RedirectToLogoutActionTask(context, ltiProviderUrl);
                        }
                    }
                    else
                    {
                        return RedirectToLogoutActionTask(context, ltiProviderUrl);
                    }
                }

                var authToken = _tokenProvider.GenerateTokens(userEmail, context.Request.Uri.Host, new[] { "lti" }, DateTimeWrapper.Now().ToUniversalTime().AddMinutes(5));
                context.RedirectUrl = $"{ltiProviderUrl}#token.lti={authToken[0].Token}";

                return Task.FromResult<object>(null);
            };
        }

        private Task RedirectToLogoutActionTask(LtiAuthenticatedContext context, string ltiProviderUrl)
        {
            context.RedirectUrl = $"{ltiProviderUrl}#logout";
            return Task.FromResult<object>(null);
        }

        private void CreateNewUser(string email, string firstName, string lastName, string ltiUserId, ConsumerTool consumerTool)
        {
            const string ltiMockData = "LTI";
            var accessType = AccessType.Plus;
            var expirationDate = DateTimeWrapper.Now().AddYears(50);
            Company company = null;

            if (consumerTool.Settings != null)
            {
                if (consumerTool.Settings.AccessType.HasValue)
                {
                    accessType = consumerTool.Settings.AccessType.Value;
                }
                if (consumerTool.Settings.ExpirationPeriodDays.HasValue)
                {
                    expirationDate = DateTimeWrapper.Now().AddDays(consumerTool.Settings.ExpirationPeriodDays.Value);
                }
                company = consumerTool.Settings.Company;
            }
            
            var user = _entityFactory.User(email, Guid.NewGuid().ToString("N"), firstName, lastName, ltiMockData, ltiMockData, ltiMockData, email, accessType, _releaseNoteFileReader.GetReleaseVersion(), expirationDate, company);

            user.AddLtiUserInfo(ltiUserId, consumerTool);

            _userRepository.Add(user);

            _eventPublisher.Publish(new CreateUserInitialDataEvent(user));

            _unitOfWork.Save();
        }
    }
}
