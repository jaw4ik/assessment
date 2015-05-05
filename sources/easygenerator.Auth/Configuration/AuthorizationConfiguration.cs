using System;
using System.Collections.Generic;
using System.Configuration;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.Auth.ConfigurationSections.Authorization;
using easygenerator.Auth.Models;
using easygenerator.Auth.Providers;
using easygenerator.Auth.Repositories;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.DataHandler.Encoder;
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
                });
        }
    }
}
