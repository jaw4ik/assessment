using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Components.Configuration.MailSender;
using System.Collections.Generic;

namespace easygenerator.Web.Mail
{
    public class MailSettings
    {
        private readonly ConfigurationReader _configurationReader;
        private readonly Dictionary<string, MailTemplate> _templatesSettings;

        public virtual MailSenderConfigurationSection MailSenderSettings
        {
            get { return _configurationReader.MailSenderConfiguration; }
        }

        public Dictionary<string, MailTemplate> MailTemplatesSettings
        {
            get { return _templatesSettings; }
        }

        public MailSettings(ConfigurationReader configurationReader)
        {
            _configurationReader = configurationReader;
            _templatesSettings = new Dictionary<string, MailTemplate>();

            foreach (var mailTemplateSetting in configurationReader.MailSenderConfiguration.MailTemplates)
            {
                MailTemplate templateSettings = (MailTemplate)mailTemplateSetting;
                _templatesSettings.Add(templateSettings.Name, templateSettings);
            }
        }
    }
}