using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace easygenerator.Web.Components.Configuration
{
    public class HttpRequestsSenderConfigurationSection : ConfigurationSection
    {
        [ConfigurationProperty("enabled", DefaultValue = "true", IsRequired = false)]
        public bool Enabled
        {
            get { return (Boolean)this["enabled"]; }
            set { this["enabled"] = value; }
        }

        [ConfigurationProperty("interval", DefaultValue = "300", IsRequired = false)]
        [IntegerValidator(ExcludeRange = false, MinValue = 60)]
        public int Interval
        {
            get { return (int)this["interval"]; }
            set { this["interval"] = value; }
        }

        [ConfigurationProperty("sendAttemptsLimit", DefaultValue = "10", IsRequired = true)]
        [IntegerValidator(ExcludeRange = false, MinValue = 5)]
        public int SendAttemptsLimit
        {
            get { return (int)this["sendAttemptsLimit"]; }
            set { this["sendAttemptsLimit"] = value; }
        }

        [ConfigurationProperty("batchSize", DefaultValue = "10", IsRequired = false)]
        [IntegerValidator(ExcludeRange = false, MinValue = 10)]
        public int BatchSize
        {
            get { return (int)this["batchSize"]; }
            set { this["batchSize"] = value; }
        }
    }
}