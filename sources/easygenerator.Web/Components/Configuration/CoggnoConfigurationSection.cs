using System.Configuration;

namespace easygenerator.Web.Components.Configuration
{
    public class CoggnoConfigurationSection : ConfigurationSection
    {
        [ConfigurationProperty("serviceUrl", IsRequired = true)]
        public string ServiceUrl {
            get
            {
                return (string)this["serviceUrl"];
            }
            set
            {
                this["serviceUrl"] = value;
            }
        }

        [ConfigurationProperty("serviceProviderUrl", IsRequired = true)]
        public string ServiceProviderUrl
        {
            get
            {
                return (string)this["serviceProviderUrl"];
            }
            set
            {
                this["serviceProviderUrl"] = value;
            }
        }

        [ConfigurationProperty("assertionCnsumerServiceUrl", IsRequired = true)]
        public string AssertionCnsumerServiceUrl
        {
            get
            {
                return (string)this["assertionCnsumerServiceUrl"];
            }
            set
            {
                this["assertionCnsumerServiceUrl"] = value;
            }
        }

        [ConfigurationProperty("issuer", IsRequired = true)]
        public string Issuer
        {
            get
            {
                return (string)this["issuer"];
            }
            set
            {
                this["issuer"] = value;
            }
        }

        [ConfigurationProperty("apiKey", IsRequired = true)]
        public string ApiKey
        {
            get
            {
                return (string)this["apiKey"];
            }
            set
            {
                this["apiKey"] = value;
            }
        }
    }
}