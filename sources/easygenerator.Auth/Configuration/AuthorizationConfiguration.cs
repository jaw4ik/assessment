using System;
using System.Collections.Generic;
using System.Configuration;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.Auth.Providers;
using easygenerator.Auth.Repositories;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Jwt;
using Microsoft.Owin.Security.OAuth;
using Owin;

namespace easygenerator.Auth.Configuration
{
    public static class AuthorizationConfiguration
    {
        public static void Configure(IAppBuilder app)
        {
            var clients = new ClientsRepository().GetCollection();
            var issuer = AuthorizationConfigurationProvider.Issuer;
            var allowedAudiences = clients.Select(t => t.Audience).Distinct();
            var issuerSecurityTokenProviders =
                clients.Select(t => new SymmetricKeyIssuerSecurityTokenProvider(issuer, t.Secret));

            app.UseJwtBearerAuthentication(
                new JwtBearerAuthenticationOptions
                {
                    AuthenticationMode = AuthenticationMode.Active,
                    AllowedAudiences = allowedAudiences,
                    IssuerSecurityTokenProviders = issuerSecurityTokenProviders,
                    Provider = new OAuthBearerAuthenticationProvider()
                    {
                        OnRequestToken = OnRequestToken
                    }
                });
        }

        private static Task OnRequestToken(OAuthRequestTokenContext oAuthRequestTokenContext)
        {
            // Only for /signalr/*
            // Get access token from query string because of WebSockets doesn't support Authorization header
            // Need to be changed as soon as another solutions will be found
            if (oAuthRequestTokenContext.Request.Path.StartsWithSegments(new PathString("/signalr")))
            {
                var value = oAuthRequestTokenContext.Request.Query.Get("access_token");
                if (!string.IsNullOrEmpty(value))
                {
                    oAuthRequestTokenContext.Token = value;
                }
            }
            return Task.FromResult<object>(null);
        }
    }
}
