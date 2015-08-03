using System.Linq;
using System.Security.Policy;
using easygenerator.Auth.Providers;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using LtiLibrary.Core.Common;
using LtiLibrary.Core.OAuth;
using LtiLibrary.Owin.Security.Lti.Provider;
using System;
using System.Threading.Tasks;
using easygenerator.DomainModel.Events.UserEvents;

namespace easygenerator.Lti.Owin.Security
{
    public class LtiAuthProvider : LtiAuthenticationProvider
    {
        private readonly IConsumerToolRepository _consumerToolRepository;
        private readonly ITokenProvider _tokenProvider;
        private readonly IDictionaryStorage _storage;
        private readonly IUserRepository _userRepository;
        private readonly IEntityFactory _entityFactory;
        private readonly IDomainEventPublisher _eventPublisher;

        public LtiAuthProvider(IConsumerToolRepository consumerToolRepository, ITokenProvider tokenProvider, IDictionaryStorage storage,
            IUserRepository userRepository, IEntityFactory entityFactory, IDomainEventPublisher eventPublisher)
        {
            _consumerToolRepository = consumerToolRepository;
            _tokenProvider = tokenProvider;
            _storage = storage;
            _userRepository = userRepository;
            _entityFactory = entityFactory;
            _eventPublisher = eventPublisher;

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

                //TODO: validate user first
                var userEmail = context.LtiRequest.LisPersonEmailPrimary;
                if (!string.IsNullOrWhiteSpace(context.LtiRequest.LisPersonEmailPrimary))
                {
                    var user = userRepository.GetUserByEmail(userEmail);
                    if (user == null)
                    {
                        CreateNewUser(userEmail, context.LtiRequest.LisPersonNameGiven,
                            context.LtiRequest.LisPersonNameFamily);
                    } else
                    {
                        
                    }

                    var tokens = _tokenProvider.GenerateTokens(userEmail, context.Request.Uri.Host,
                        AuthorizationConfigurationProvider.Endpoints.Select(_ => _.Name));

                    var ltiAuthUrl = context.LtiRequest.Parameters[Constants.ToolProviderAuthUrl];
                    var ltiToken = "launch";

                    if (ltiAuthUrl == null)
                    {
                        ltiAuthUrl = context.Request.Uri.GetLeftPart(UriPartial.Authority);
                    }
                    ltiAuthUrl = string.Format(ltiAuthUrl.Contains("#") ? "{0}&token.lti={1}" : "{0}#token.lti={1}", ltiAuthUrl, ltiToken);

                    _storage.Add(Constants.TokensStorageKey, tokens);

                    context.RedirectUrl = ltiAuthUrl;
                }
                return Task.FromResult<object>(null);
            };
        }

        public void CreateNewUser(string email, string firstName, string lastName)
        {
            var user = _entityFactory.User(email, "LTI", firstName, lastName, "LTI", "LTI", "LTI", email);
            _userRepository.Add(user);

            _eventPublisher.Publish(new CreateUserInitialDataEvent(user));
        }
    }
}
