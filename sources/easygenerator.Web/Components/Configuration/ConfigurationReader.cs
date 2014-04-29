﻿using System.Configuration;
using easygenerator.Web.Components.Configuration.ExternalApi;
using easygenerator.Web.Components.Configuration.MailSender;

namespace easygenerator.Web.Components.Configuration
{
    public class ConfigurationReader
    {
        public virtual FileStorageConfigurationSection FileStorageConfiguration
        {
            get
            {
                return ConfigurationManager.GetSection("FileStorage") as FileStorageConfigurationSection;
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

        public virtual string ConnectionString
        {
            get { return ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString; }
        }
    }
}