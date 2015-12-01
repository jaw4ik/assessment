using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace easygenerator.StorageServer.Components.ConfigurationSections
{
    public class IssuerElement : ConfigurationElement
    {
        [ConfigurationProperty("name", IsRequired = true)]
        public string Name
        {
            get { return (string)base["name"]; }
            set { base["name"] = value; }
        }

        [ConfigurationProperty("identityUrl", IsRequired = true)]
        public string IdentityUrl
        {
            get { return (string)base["identityUrl"]; }
            set { base["identityUrl"] = value; }
        }

        [ConfigurationPropertyAttribute("secret", IsRequired = true)]
        public virtual string Secret
        {
            get { return (string)base["secret"]; }
            set { base["secret"] = value; }
        }
    }
}