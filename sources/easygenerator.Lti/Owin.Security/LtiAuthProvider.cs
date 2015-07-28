﻿using System.Linq;
using easygenerator.Auth.Providers;
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
        private readonly ITokenProvider _tokenProvider;

        public LtiAuthProvider(IConsumerToolRepository consumerToolRepository, ITokenProvider tokenProvider)
        {
            _consumerToolRepository = consumerToolRepository;
            _tokenProvider = tokenProvider;

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
                //Request.Url.Host,

                //TODO: validate user first

                if (!string.IsNullOrWhiteSpace(context.LtiRequest.LisPersonEmailPrimary))
                {

                    var tokens = _tokenProvider.GenerateTokens(context.LtiRequest.LisPersonEmailPrimary, context.Request.Uri.Host,
                        AuthorizationConfigurationProvider.Endpoints.Select(_ => _.Name));

                    context.Response.StatusCode = 302;
                    //context.Response.Headers.Set("Location", urlToRedirect);

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
