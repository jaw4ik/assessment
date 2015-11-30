using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace easygenerator.StorageServer.Components.ConfigurationSections
{
    public class ConvertionServiceConfigurationSection : ConfigurationSection
    {
        [ConfigurationProperty("token", IsRequired = true)]
        public string Token
        {
            get
            {
                return (string)this["token"];
            }
            set
            {
                this["token"] = value;
            }
        }

        [ConfigurationProperty("url", IsRequired = true)]
        public string Url
        {
            get
            {
                return (string)this["url"];
            }
            set
            {
                this["url"] = value;
            }
        }
    }
}