using System;
using System.Configuration;
using System.Linq;
using System.Security.Claims;
using System.Web.Helpers;
using easygenerator.StorageServer.Components.ConfigurationSections;
using Microsoft.Owin.Security.Jwt;
using Microsoft.Owin.Security.OAuth;
using Owin;

namespace easygenerator.StorageServer.Configuration
{
    public static class AuthorizationConfiguration
    {
        public static void Configure(IAppBuilder app)
        {
            var authorizationConfig = (ConfigurationManager.GetSection("authorization") as AuthorizationSection);
            var allowedAudiences = new[] { authorizationConfig.Audience };
            var issuerSecurityTokenProviders = authorizationConfig.Issuers
                                                                  .Cast<IssuerElement>()
                                                                  .Select(_ => new SymmetricKeyIssuerSecurityTokenProvider(_.Name, _.Secret));

            app.UseJwtBearerAuthentication(
                new JwtBearerAuthenticationOptions
                {
                    AuthenticationMode = Microsoft.Owin.Security.AuthenticationMode.Active,
                    AllowedAudiences = allowedAudiences,
                    IssuerSecurityTokenProviders = issuerSecurityTokenProviders,
                    Provider = new OAuthBearerAuthenticationProvider()
                });
        }
    }
}
