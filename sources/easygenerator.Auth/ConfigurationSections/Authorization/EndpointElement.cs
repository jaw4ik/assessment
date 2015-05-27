using System.Configuration;
using easygenerator.Auth.Models;

namespace easygenerator.Auth.ConfigurationSections.Authorization
{
    public class EndpointElement : ConfigurationElement
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

        [ConfigurationProperty("scopes", IsRequired = true)]
        public string Scopes
        {
            get { return (string)base["scopes"]; }
            set { base["scopes"] = value; }
        }

        [ConfigurationProperty("audience", IsRequired = true)]
        public string Audience
        {
            get { return (string)base["audience"]; }
            set { base["audience"] = value; }
        }

        [ConfigurationProperty("apiKey")]
        public string ApiKey
        {
            get { return (string)base["apiKey"]; }
            set { base["apiKey"] = value; }
        }

    }
}
