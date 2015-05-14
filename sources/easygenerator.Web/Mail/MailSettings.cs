using easygenerator.Infrastructure.Mail;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Components.Configuration.MailSender;
using System.Collections.Generic;

namespace easygenerator.Web.Mail
{
    public class MailSettings : IMailSettings
    {
        private readonly ConfigurationReader _configurationReader;
        private readonly Dictionary<string, IMailTemplate> _templatesSettings;

        public virtual MailSenderConfigurationSection MailSenderSettings
        {
            get { return _configurationReader.MailSenderConfiguration; }
        }

        public Dictionary<string, IMailTemplate> MailTemplatesSettings
        {
            get { return _templatesSettings; }
        }

        public MailSettings(ConfigurationReader configurationReader)
        {
            _configurationReader = configurationReader;
            _templatesSettings = new Dictionary<string, IMailTemplate>();

            foreach (var mailTemplateSetting in configurationReader.MailSenderConfiguration.MailTemplates)
            {
                IMailTemplate templateSettings = (MailTemplate)mailTemplateSetting;
                _templatesSettings.Add(templateSettings.Name, templateSettings);
            }
        }
    }
}