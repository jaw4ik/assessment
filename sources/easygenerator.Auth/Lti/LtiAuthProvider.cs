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
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using System.Web;
using easygenerator.Auth.Security.Models;
using easygenerator.Auth.Security.Providers;
using easygenerator.DomainModel.Events.UserEvents;

namespace easygenerator.Auth.Lti
{
    public class LtiAuthProvider : LtiAuthenticationProvider
    {
        private readonly IConsumerToolRepository _consumerToolRepository;
        private readonly IUserRepository _userRepository;
        private readonly IEntityFactory _entityFactory;
        private readonly ITokenProvider _tokenProvider;
        private readonly IDomainEventPublisher _eventPublisher;
        private readonly IReleaseNoteFileReader _releaseNoteFileReader;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISecureTokenProvider<ISecure<LtiUserInfo>> _secureTokenProvider;

        public LtiAuthProvider(IConsumerToolRepository consumerToolRepository, IUserRepository userRepository,
            IEntityFactory entityFactory, ITokenProvider tokenProvider, IDomainEventPublisher eventPublisher, IReleaseNoteFileReader releaseNoteFileReader, IUnitOfWork unitOfWork, ISecureTokenProvider<ISecure<LtiUserInfo>> secureTokenProvider)
        {
            _consumerToolRepository = consumerToolRepository;
            _userRepository = userRepository;
            _entityFactory = entityFactory;
            _tokenProvider = tokenProvider;
            _eventPublisher = eventPublisher;
            _releaseNoteFileReader = releaseNoteFileReader;
            _unitOfWork = unitOfWork;
            _secureTokenProvider = secureTokenProvider;

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

                var consumerSignature = context.LtiRequest.GenerateSignature(consumerTool.Secret);
                if (!consumerSignature.Equals(context.LtiRequest.Signature))
                {
                    throw new LtiException("Invalid " + OAuthConstants.SignatureParameter);
                }

                return Task.FromResult<object>(null);
            };

            OnAuthenticated = context =>
            {
                var consumerTool = _consumerToolRepository.GetByKey(context.LtiRequest.ConsumerKey);
                if (consumerTool == null)
                {
                    throw new LtiException("Invalid " + OAuthConstants.ConsumerKeyParameter);
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
                    if (user.GetLtiUserInfo(context.LtiRequest.UserId, consumerTool) == null)
                    {
                        return RedirectToRoot(context, ltiProviderUrl, consumerTool, user);
                    }
                }

                var authToken = _tokenProvider.GenerateTokens(userEmail, context.Request.Uri.Host, new[] { "lti" }, DateTimeWrapper.Now().ToUniversalTime().AddMinutes(5));
                var redirectUrl = $"{ltiProviderUrl}#token.lti={authToken[0].Token}";

                if (consumerTool.Settings?.Company?.Id != null)
                {
                    redirectUrl = $"{redirectUrl}&companyId={consumerTool.Settings.Company.Id.ToString("N")}";
                }

                context.RedirectUrl = redirectUrl;

                return Task.FromResult<object>(null);
            };
        }

        private Task RedirectToRoot(LtiAuthenticatedContext context, string ltiProviderUrl, ConsumerTool consumerTool, User user)
        {
            var ltiUserInfo = _entityFactory.LtiUserInfo(context.LtiRequest.UserId, consumerTool, user);
            var ltiUserInfoSecure = new LtiUserInfoSecure(ltiUserInfo);
            var token = HttpUtility.UrlEncode(_secureTokenProvider.GenerateToken(ltiUserInfoSecure));

            context.RedirectUrl = $"{ltiProviderUrl}#token.user.lti={token}";
            return Task.FromResult<object>(null);
        }

        private void CreateNewUser(string email, string firstName, string lastName, string ltiUserId, ConsumerTool consumerTool)
        {
            const string ltiMockData = "LTI";
            var accessType = AccessType.Academy;
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

            var userPassword = Guid.NewGuid().ToString("N");
            var user = _entityFactory.User(email, userPassword, firstName, lastName, ltiMockData, ltiMockData, ltiMockData, email, accessType, _releaseNoteFileReader.GetReleaseVersion(), expirationDate, true, false, company != null ? new Collection<Company>() { company } : null);

            user.AddLtiUserInfo(ltiUserId, consumerTool);

            _userRepository.Add(user);

            _eventPublisher.Publish(new UserSignedUpEvent(user, userPassword));
            _eventPublisher.Publish(new CreateUserInitialDataEvent(user));

            _unitOfWork.Save();
        }
    }
}
