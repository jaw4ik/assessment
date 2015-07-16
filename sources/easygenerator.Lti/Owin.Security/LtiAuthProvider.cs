using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using LtiLibrary.Core.Common;
using LtiLibrary.Core.OAuth;
using LtiLibrary.Owin.Security.Lti.Provider;
using System;
using System.Threading.Tasks;

namespace easygenerator.Lti.Owin.Security
{
    public class LtiAuthProvider : LtiAuthenticationProvider
    {
        private readonly IConsumerToolRepository _consumerToolRepository;

        public LtiAuthProvider(IConsumerToolRepository consumerToolRepository)
        {
            _consumerToolRepository = consumerToolRepository;
            
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
                if (!string.IsNullOrWhiteSpace(context.LtiRequest.LisPersonEmailPrimary))
                {
                    //_authenticationManager.SignIn(
                    //    context.LtiRequest.LisPersonEmailPrimary,
                    //    context.LtiRequest.LisPersonNameGiven,
                    //    context.LtiRequest.LisPersonNameFamily,
                    //    context.LtiRequest.LisPersonNameFull
                    //    );
                }
                return Task.FromResult<object>(null);
            };
        }


    }
}
