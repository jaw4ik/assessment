using System;
using easygenerator.Web.Components.Configuration.MailSender;
using System.Configuration;
using easygenerator.Web.Components.Configuration.CourseExamples;
using easygenerator.Web.Components.Configuration.SAML;
using easygenerator.Web.Components.Configuration.DataDog;

namespace easygenerator.Web.Components.Configuration
{
    public class ConfigurationReader
    {
        public virtual FileStorageConfigurationSection FileStorageConfiguration => ConfigurationManager.GetSection("fileStorage") as FileStorageConfigurationSection;

        public virtual TemplateStorageConfigurationSection TempateStorageConfiguration => ConfigurationManager.GetSection("templateStorage") as TemplateStorageConfigurationSection;

        public virtual MailSenderConfigurationSection MailSenderConfiguration => ConfigurationManager.GetSection("mailSender") as MailSenderConfigurationSection;

        public virtual int PasswordRecoveryExpirationInterval => int.Parse(ConfigurationManager.AppSettings["PasswordRecoveryTicketExpirationInterval"]);

        public virtual MailChimpConfigurationSection MailChimpConfiguration => ConfigurationManager.GetSection("mailChimp") as MailChimpConfigurationSection;

        public virtual DataDogStatsDClientConfigurationSection DataDogStatsDClientConfiguration => ConfigurationManager.GetSection("dataDogStatsDClient") as DataDogStatsDClientConfigurationSection;

        public virtual ExternalApiSection ExternalApi => ConfigurationManager.GetSection("externalApi") as ExternalApiSection;

        public virtual HttpRequestsSenderConfigurationSection HttpRequestsSenderConfiguration => ConfigurationManager.GetSection("httpRequestsSender") as HttpRequestsSenderConfigurationSection;

        public virtual WooCommerceConfigurationSection WooCommerceConfiguration => ConfigurationManager.GetSection("wooCommerce") as WooCommerceConfigurationSection;

        public virtual PublicationConfigurationSection PublicationConfiguration => ConfigurationManager.GetSection("publication") as PublicationConfigurationSection;

        public virtual CourseImportConfigurationSection CourseImportConfiguration => ConfigurationManager.GetSection("courseImport") as CourseImportConfigurationSection;

        public virtual BranchTrackConfigurationSection BranchTrackConfiguration => ConfigurationManager.GetSection("branchtrack") as BranchTrackConfigurationSection;

        public virtual WinToWebConfigurationSection WinToWebConfiguration => ConfigurationManager.GetSection("wintoweb") as WinToWebConfigurationSection;

        public virtual IntercomConfigurationSection IntercomConfiguration => ConfigurationManager.GetSection("intercom") as IntercomConfigurationSection;

        public virtual CoggnoConfigurationSection CoggnoConfiguration => ConfigurationManager.GetSection("coggno") as CoggnoConfigurationSection;

        public virtual SamlIdPConfigurationSection SamlIdPConfiguration => ConfigurationManager.GetSection("samlIdP") as SamlIdPConfigurationSection;

        public virtual CourseExamplesConfigurationSection CourseExamplesConfiguration => ConfigurationManager.GetSection("courseExamples") as CourseExamplesConfigurationSection;

        public virtual SurveyPopupConfigurationSection SurveyPopup => ConfigurationManager.GetSection("surveyPopup") as SurveyPopupConfigurationSection;

        public virtual string ConnectionString => ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;

        public virtual string PreviewAllowedUsers => ConfigurationManager.AppSettings["preview.allowedUsers"] ?? string.Empty;

        public virtual string StorageServiceUrl => ConfigurationManager.AppSettings["StorageServiceUrl"] ?? string.Empty;

        public virtual string ImageSeviceUrl => ConfigurationManager.AppSettings["ImageSeviceUrl"] ?? string.Empty;

        public virtual string MagickNetCacheDirectory => ConfigurationManager.AppSettings["magick.net.cachedirectory"] ?? string.Empty;

        public string LtiAuthPath => ConfigurationManager.AppSettings["lti.auth.path"];

        public string ReleaseVersion => ConfigurationManager.AppSettings["version"];

        public bool ImageLibraryOnlyHttps => Convert.ToBoolean(ConfigurationManager.AppSettings["ImageLibraryOnlyHttps"]);

        public virtual GoogleFontsApiConfigurationSection GoogleFontsApiConfiguration => ConfigurationManager.GetSection("googleFontsApi") as GoogleFontsApiConfigurationSection;

        public string CustomFontPath => ConfigurationManager.AppSettings["customFontPath"];

        public virtual SentryConfigurationSection SentriConfiguration => ConfigurationManager.GetSection("sentry") as SentryConfigurationSection;
        public virtual ReCaptchaConfigurationSection ReCaptchaConfiguration => ConfigurationManager.GetSection("reCaptcha") as ReCaptchaConfigurationSection;

        public virtual SlackConfigurationSection SlackConfigurationSection => ConfigurationManager.GetSection("slack") as SlackConfigurationSection;

    }
}