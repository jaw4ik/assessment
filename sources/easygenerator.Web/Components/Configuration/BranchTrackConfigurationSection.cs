using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using easygenerator.Web.Components.Configuration.ApiKeys;

namespace easygenerator.Web.Components.Configuration
{
    public class BranchTrackConfigurationSection : ConfigurationSection
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

        [ConfigurationProperty("apiKeys", IsRequired = true)]
        public virtual ApiKeyCollection ApiKeys
        {
            get { return ((ApiKeyCollection)(base["apiKeys"])); }
            set { base["apiKeys"] = value; }
        }
    }
}