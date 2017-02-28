using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace easygenerator.Web.Components.Configuration
{
    public class LrsConfigurationSection : ConfigurationSection
    {

        [ConfigurationProperty("lrsHostUrl", IsRequired = true)]
        public string lrsHostUrl
        {
            get
            {
                return (string)this["lrsHostUrl"];
            }
            set
            {
                this["lrsHostUrl"] = value;
            }
        }
    }
}