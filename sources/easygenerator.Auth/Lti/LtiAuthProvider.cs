﻿using easygenerator.Auth.Providers;
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
        private readonly IDependencyResolverWrapper _dependencyResolver;
        private readonly IReleaseNoteFileReader _releaseNoteFileReader;

        public LtiAuthProvider(IConsumerToolRepository consumerToolRepository, ITokenProvider tokenProvider, IUserRepository userRepository,
            IEntityFactory entityFactory, IDomainEventPublisher eventPublisher, IDependencyResolverWrapper dependencyResolver, IReleaseNoteFileReader releaseNoteFileReader)
        {
            _consumerToolRepository = consumerToolRepository;
            _tokenProvider = tokenProvider;
            _userRepository = userRepository;
            _entityFactory = entityFactory;
            _eventPublisher = eventPublisher;
            _dependencyResolver = dependencyResolver;
            _releaseNoteFileReader = releaseNoteFileReader;

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
                    var userInfo = user.GetLtiUserInfo(consumerTool);
                    if (userInfo == null || userInfo.LtiUserId != context.LtiRequest.UserId)
                    {
                        context.RedirectUrl = string.Format("{0}#logout", ltiProviderUrl);
                        return Task.FromResult<object>(null);
                    }
                }

                var authToken = _tokenProvider.GenerateTokens(userEmail, context.Request.Uri.Host, new[] { "auth" });
                context.RedirectUrl = string.Format("{0}#token.auth={1}", ltiProviderUrl, authToken[0].Token);

                return Task.FromResult<object>(null);
            };
        }

        private void CreateNewUser(string email, string firstName, string lastName, string ltiUserId, ConsumerTool consumerTool)
        {
            const string ltiMockData = "LTI";
            var dataContext = _dependencyResolver.GetService<IUnitOfWork>();
            var userRepository = _dependencyResolver.GetService<IUserRepository>();

            var user = _entityFactory.User(email, Guid.NewGuid().ToString("N"), firstName, lastName, ltiMockData, ltiMockData, ltiMockData, email, AccessType.Plus, _releaseNoteFileReader.GetReleaseVersion(), DateTimeWrapper.Now().AddYears(50));

            user.AddLtiUserInfo(ltiUserId, consumerTool);

            userRepository.Add(user);

            _eventPublisher.Publish(new CreateUserInitialDataEvent(user));

            dataContext.Save();
        }
    }
}
