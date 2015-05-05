using System;
using System.Collections.Generic;
using System.Configuration;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.Auth.ConfigurationSections.Authorization;
using easygenerator.Auth.Models;

namespace easygenerator.Auth.Providers
{
    public static class AuthorizationConfigurationProvider
    {
        private static readonly string _issuer;
        private static List<ClientModel> _clients;

        public static string Issuer {get { return _issuer; }}
        public static List<ClientModel> Clients { get { return _clients; } }

        static AuthorizationConfigurationProvider()
        {
            _issuer = (ConfigurationManager.GetSection("authorization") as AuthorizationSection).Issuer;

            _clients = new List<ClientModel>();
            var authSection = ConfigurationManager.GetSection("authorization") as AuthorizationSection;
            foreach (ClientElement client in authSection.Clients)
            {
                _clients.Add(new ClientModel()
                {
                    Audience = client.Audience,
                    Host = client.Host,
                    Name = client.Name,
                    Secret = Convert.FromBase64String(client.Secret)
                });
            }
        }
    }
}
