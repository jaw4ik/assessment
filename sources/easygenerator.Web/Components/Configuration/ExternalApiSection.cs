using System;
using System.Configuration;
using easygenerator.Web.Components.Configuration.ApiKeys;

namespace easygenerator.Web.Components.Configuration
{
    public class ExternalApiSection : ConfigurationSection
    {
        [ConfigurationPropertyAttribute("requiresHttps", DefaultValue = "true", IsRequired = true)]
        public virtual bool RequiresHttps {
            get { return (Boolean)base["requiresHttps"]; }
            set { base["requiresHttps"] = value; }
        }

        [ConfigurationProperty("apiKeys", IsRequired = true)]
        public virtual ApiKeyCollection ApiKeys
        {
            get { return ((ApiKeyCollection)(base["apiKeys"])); }
            set { base["apiKeys"] = value; }
        }
    }
}