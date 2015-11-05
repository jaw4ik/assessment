using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Helpers;
using easygenerator.Auth.Models;
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

            app.UseJwtBearerAuthentication(
                new JwtBearerAuthenticationOptions
                {
                    AuthenticationMode = AuthenticationMode.Active,
                    AllowedAudiences = allowedAudiences,
                    IssuerSecurityTokenProviders = GetIssuerSecurityTokenProviders(issuer, endpoints),
                    Provider = new OAuthBearerAuthenticationProvider()
                    {
                        OnRequestToken = OnRequestToken
                    }
                });

            AntiForgeryConfig.UniqueClaimTypeIdentifier = ClaimTypes.Name;
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

            // Get access token from cookie
            // TODO: This parts are need to be moved into SPA or opened to unauthorized request

            var paths = new[] { "/preview", "/dashboard", "/democourses", "/templates" };
            if (paths.Any(_ => oAuthRequestTokenContext.Request.Path.StartsWithSegments(new PathString(_))))
            {
                var value = oAuthRequestTokenContext.Request.Cookies["token.preview"];
                if (!string.IsNullOrEmpty(value))
                {
                    oAuthRequestTokenContext.Token = value;
                }
            }

            // Only for /account/upgrade/*
            // Get access token from cookie.
            // TODO: Upgrade account should be changed to token auth.
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

        private static List<IIssuerSecurityTokenProvider> GetIssuerSecurityTokenProviders(string issuer, ICollection<EndpointModel> endpoints)
        {
            var issuerSecurityTokenProviders = new List<IIssuerSecurityTokenProvider>();
            if (!string.IsNullOrEmpty(issuer))
            {
                var issuers = issuer.Split(',').ToList();
                issuers.ForEach(
                            i =>
                                issuerSecurityTokenProviders.AddRange(
                                    endpoints.Select(t => new SymmetricKeyIssuerSecurityTokenProvider(i.Trim(), t.Secret)))
                            );

            }

            return issuerSecurityTokenProviders;
        }
    }
}
