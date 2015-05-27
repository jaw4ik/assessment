using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.Auth.ConfigurationSections.Authorization;

namespace easygenerator.Auth.ConfigurationSections.Authorization
{
    public class AuthorizationSection : ConfigurationSection
    {
        [ConfigurationPropertyAttribute("issuer",IsRequired = true)]
        public virtual string Issuer
        {
            get { return (string)base["issuer"]; }
            set { base["issuer"] = value; }
        }

        [ConfigurationProperty("endpoints", IsRequired = true)]
        public virtual EndpointsCollection Endpoints
        {
            get { return ((EndpointsCollection)(base["endpoints"])); }
            set { base["endpoints"] = value; }
        }
    }
}
