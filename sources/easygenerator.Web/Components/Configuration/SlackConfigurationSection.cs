using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using easygenerator.Web.Components.Configuration.ApiKeys;

namespace easygenerator.Web.Components.Configuration
{
    public class SlackConfigurationSection : ConfigurationSection
    {
        [ConfigurationProperty("webhookUrl", IsRequired = true)]
        public string WebhookUrl
        {
            get
            {
                return (string)this["webhookUrl"];
            }
            set
            {
                this["webhookUrl"] = value;
            }
        }

        [ConfigurationProperty("enabled", DefaultValue = "false", IsRequired = false)]
        public virtual bool Enabled
        {
            get { return (bool)base["enabled"]; }
            set { base["enabled"] = value; }
        }
    }
}