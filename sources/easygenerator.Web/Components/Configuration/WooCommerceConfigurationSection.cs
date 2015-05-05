using System;
using System.Configuration;

namespace easygenerator.Web.Components.Configuration
{
    public class WooCommerceConfigurationSection : ConfigurationSection
    {
        [ConfigurationProperty("enabled", DefaultValue = "true", IsRequired = false)]
        public bool Enabled
        {
            get { return (Boolean)this["enabled"]; }
            set { this["enabled"] = value; }
        }

        [ConfigurationProperty("serviceUrl", IsRequired = true)]
        public string ServiceUrl
        {
            get
            {
                return (string)this["serviceUrl"];
            }
            set
            {
                this["serviceUrl"] = value;
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

        [ConfigurationProperty("autologinKey", IsRequired = true)]
        public string AutologinKey
        {
            get
            {
                return (string)this["autologinKey"];
            }
            set
            {
                this["autologinKey"] = value;
            }
        }

        [ConfigurationProperty("autologinVector", IsRequired = true)]
        public string AutologinVector
        {
            get
            {
                return (string)this["autologinVector"];
            }
            set
            {
                this["autologinVector"] = value;
            }
        }

    }
}