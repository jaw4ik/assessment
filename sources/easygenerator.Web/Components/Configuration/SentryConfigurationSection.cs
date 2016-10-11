using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace easygenerator.Web.Components.Configuration
{
    public class SentryConfigurationSection : ConfigurationSection
    {
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
    }
}