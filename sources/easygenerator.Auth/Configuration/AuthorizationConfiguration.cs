using System.Linq;
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
            var endpoints = new EndpointsRepository().GetCollection();
            var issuer = AuthorizationConfigurationProvider.Issuer;
            var allowedAudiences = endpoints.Select(t => t.Audience).Distinct();
            var issuerSecurityTokenProviders =
                endpoints.Select(t => new SymmetricKeyIssuerSecurityTokenProvider(issuer, t.Secret));

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

            // Only for /preview/*
            // Get access token from coockies for preview
            if (oAuthRequestTokenContext.Request.Path.StartsWithSegments(new PathString("/preview")))
            {
                var value = oAuthRequestTokenContext.Request.Cookies["token.preview"];
                if (!string.IsNullOrEmpty(value))
                {
                    oAuthRequestTokenContext.Token = value;
                }
            }
            
            // Only for /account/upgrade/*
            // Get access token from coockies.
            // Upgrade account should be changed to token auth.
            if (oAuthRequestTokenContext.Request.Path.StartsWithSegments(new PathString("/account/upgrade")))
            {
                var value = oAuthRequestTokenContext.Request.Cookies["token.upgradeAccount"];
                if (!string.IsNullOrEmpty(value))
                {
                    oAuthRequestTokenContext.Token = value;
                }
            }

            return Task.FromResult<object>(null);
        }
    }
}
