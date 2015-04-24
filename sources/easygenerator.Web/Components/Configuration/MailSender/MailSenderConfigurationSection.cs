using System;
using System.Configuration;

namespace easygenerator.Web.Components.Configuration.MailSender
{
    public class MailSenderConfigurationSection : ConfigurationSection
    {
        [ConfigurationProperty("mailTemplates", IsRequired = true)]
        public MailTemplateCollection MailTemplates
        {
            get { return ((MailTemplateCollection)(base["mailTemplates"])); }
            set { base["mailTemplates"] = value; }
        }

        [ConfigurationProperty("enable", DefaultValue = "true", IsRequired = false)]
        public bool Enable
        {
            get { return (Boolean)this["enable"]; }
            set { this["enable"] = value; }
        }

        [ConfigurationProperty("batchSize", DefaultValue = "50", IsRequired = false)]
        [IntegerValidator(ExcludeRange = false, MinValue = 10)]
        public int BatchSize
        {
            get { return (int)this["batchSize"]; }
            set { this["size"] = value; }
        }

        [ConfigurationProperty("interval", DefaultValue = "300", IsRequired = false)]
        [IntegerValidator(ExcludeRange = false, MinValue = 60)]
        public int Interval
        {
            get { return (int)this["interval"]; }
            set { this["interval"] = value; }
        }
    }
}