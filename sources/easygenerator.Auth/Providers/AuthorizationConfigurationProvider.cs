using System;
using System.Collections.Generic;
using System.Configuration;
using easygenerator.Auth.ConfigurationSections.Authorization;
using easygenerator.Auth.Models;

namespace easygenerator.Auth.Providers
{
    public static class AuthorizationConfigurationProvider
    {
        private static readonly string _scopeClaimType;
        private static readonly string _issuer;
        private static List<EndpointModel> _endpoints;

        public static string ScopeClaimType { get { return _scopeClaimType; } }
        public static string Issuer { get { return _issuer; } }
        public static List<EndpointModel> Endpoints { get { return _endpoints; } }

        static AuthorizationConfigurationProvider()
        {
            _scopeClaimType = "scope";

            _issuer = (ConfigurationManager.GetSection("authorization") as AuthorizationSection).Issuer;

            _endpoints = new List<EndpointModel>();
            var authSection = ConfigurationManager.GetSection("authorization") as AuthorizationSection;
            foreach (EndpointElement endpoint in authSection.Endpoints)
            {
                _endpoints.Add(new EndpointModel()
                {
                    Audience = endpoint.Audience,
                    Scopes = endpoint.Scopes,
                    Name = endpoint.Name,
                    Secret = Convert.FromBase64String(endpoint.Secret)
                });
            }
        }
    }
}
