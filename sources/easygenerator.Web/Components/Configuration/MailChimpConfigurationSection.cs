using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace easygenerator.Web.Components.Configuration
{
    public class MailChimpConfigurationSection : ConfigurationSection
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

        /// <summary>
        /// List name to add subscribers to.
        /// </summary>
        [ConfigurationProperty("listName", IsRequired = true)]
        public string ListName
        {
            get
            {
                return (string)this["listName"];
            }
            set
            {
                this["listName"] = value;
            }
        }
    }
}