using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace easygenerator.StorageServer.Components.ConfigurationSections
{
    public class AuthorizationSection : ConfigurationSection
    {
        [ConfigurationPropertyAttribute("scopes", IsRequired = true)]
        public virtual string Scopes
        {
            get { return (string)base["scopes"]; }
            set { base["scopes"] = value; }
        }

        [ConfigurationPropertyAttribute("audience", IsRequired = true)]
        public virtual string Audience
        {
            get { return (string)base["audience"]; }
            set { base["audience"] = value; }
        }

        [ConfigurationProperty("issuers", IsRequired = true)]
        public virtual IssuersCollection Issuers
        {
            get { return ((IssuersCollection)(base["issuers"])); }
            set { base["issuers"] = value; }
        }
    }
}