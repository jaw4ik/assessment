using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.Auth.ConfigurationSections.Authorization
{
    public class ClientElement : ConfigurationElement
    {
        [ConfigurationProperty("name", IsRequired = true)]
        public string Name
        {
            get { return (string)base["name"]; }
            set { base["name"] = value; }
        }

        [ConfigurationProperty("secret", IsRequired = true)]
        public string Secret
        {
            get { return (string)base["secret"]; }
            set { base["secret"] = value; }
        }

        [ConfigurationProperty("host", IsRequired = true)]
        public string Host
        {
            get { return (string)base["host"]; }
            set { base["host"] = value; }
        }

        [ConfigurationProperty("audience", IsRequired = true)]
        public string Audience
        {
            get { return (string)base["audience"]; }
            set { base["audience"] = value; }
        }

        [ConfigurationProperty("apiKey", IsRequired = true)]
        public string ApiKey
        {
            get { return (string)base["apiKey"]; }
            set { base["apiKey"] = value; }
        }
    }
}
