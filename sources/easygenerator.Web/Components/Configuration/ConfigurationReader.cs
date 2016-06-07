using System;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Components.Configuration.MailSender;
using System.Configuration;
using easygenerator.Web.Components.Configuration.SAML;

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

        public virtual BranchTrackConfigurationSection BranchTrackConfiguration
        {
            get
            {
                return ConfigurationManager.GetSection("branchtrack") as BranchTrackConfigurationSection;
            }
        }

        public virtual WinToWebConfigurationSection WinToWebConfiguration
        {
            get
            {
                return ConfigurationManager.GetSection("wintoweb") as WinToWebConfigurationSection;
            }
        }

        public virtual IntercomConfigurationSection IntercomConfiguration
        {
            get
            {
                return ConfigurationManager.GetSection("intercom") as IntercomConfigurationSection;
            }
        }

        public virtual SamlIdPConfigurationSection SamlIdPConfiguration => ConfigurationManager.GetSection("samlIdP") as SamlIdPConfigurationSection;

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

        public virtual string MagickNetCacheDirectory
        {
            get { return ConfigurationManager.AppSettings["magick.net.cachedirectory"] ?? string.Empty; }
        }

        public string LtiAuthPath
        {
            get { return ConfigurationManager.AppSettings["lti.auth.path"]; }
        }

        public string ReleaseVersion
        {
            get { return ConfigurationManager.AppSettings["version"]; }
        }

        public bool ImageLibraryOnlyHttps
        {
            get { return Convert.ToBoolean(ConfigurationManager.AppSettings["ImageLibraryOnlyHttps"]); }
        }

        public virtual GoogleFontsApiConfigurationSection GoogleFontsApiConfiguration
        {
            get
            {
                return ConfigurationManager.GetSection("googleFontsApi") as GoogleFontsApiConfigurationSection;
            }
        }
    }
}