using System;
using easygenerator.Web.Components.Configuration.ExternalApi;
using easygenerator.Web.Components.Configuration.MailSender;
using System.Configuration;

namespace easygenerator.Web.Components.Configuration
{
    public class ConfigurationReader
    {
        public virtual FileStorageConfigurationSection FileStorageConfiguration
        {
            get
            {
                return ConfigurationManager.GetSection("fileStorage") as FileStorageConfigurationSection;
            }
        }

        public virtual TemplateStorageConfigurationSection TempateStorageConfiguration
        {
            get
            {
                return ConfigurationManager.GetSection("templateStorage") as TemplateStorageConfigurationSection;
            }
        }

        public virtual MailSenderConfigurationSection MailSenderConfiguration
        {
            get
            {
                return ConfigurationManager.GetSection("mailSender") as MailSenderConfigurationSection;
            }
        }

        public virtual int PasswordRecoveryExpirationInterval
        {
            get
            {
                return int.Parse(ConfigurationManager.AppSettings["PasswordRecoveryTicketExpirationInterval"]);
            }
        }

        public virtual MailChimpConfigurationSection MailChimpConfiguration
        {
            get
            {
                return ConfigurationManager.GetSection("mailChimp") as MailChimpConfigurationSection;
            }
        }

        public virtual Aim4YouConfigurationSection Aim4YouConfiguration
        {
            get
            {
                return ConfigurationManager.GetSection("aim4You") as Aim4YouConfigurationSection;
            }
        }

        public virtual ExternalApiSection ExternalApi
        {
            get
            {
                return ConfigurationManager.GetSection("externalApi") as ExternalApiSection;
            }
        }

        public virtual HttpRequestsSenderConfigurationSection HttpRequestsSenderConfiguration
        {
            get
            {
                return ConfigurationManager.GetSection("httpRequestsSender") as HttpRequestsSenderConfigurationSection;
            }
        }

        public virtual WooCommerceConfigurationSection WooCommerceConfiguration
        {
            get
            {
                return ConfigurationManager.GetSection("wooCommerce") as WooCommerceConfigurationSection;
            }
        }

        public virtual PublicationConfigurationSection PublicationConfiguration
        {
            get
            {
                return ConfigurationManager.GetSection("publication") as PublicationConfigurationSection;
            }
        }

        public virtual CourseImportConfigurationSection CourseImportConfiguration
        {
            get
            {
                return ConfigurationManager.GetSection("courseImport") as CourseImportConfigurationSection;
            }
        }

        public virtual string ConnectionString
        {
            get { return ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString; }
        }

        public virtual string PreviewAllowedUsers
        {
            get { return ConfigurationManager.AppSettings["preview.allowedUsers"] ?? string.Empty; }
        }

        public virtual string StorageServiceUrl
        {
            get { return ConfigurationManager.AppSettings["StorageServiceUrl"] ?? string.Empty; }
        }
    }
}