using System.Configuration;

namespace easygenerator.Web.Components.Configuration
{
    public class ReCaptchaConfigurationSection : ConfigurationSection
    {
        [ConfigurationProperty("enabled", DefaultValue = "false", IsRequired = false)]
        public virtual bool Enabled
        {
            get { return (bool)base["enabled"]; }
            set { base["enabled"] = value; }
        }

        [ConfigurationProperty("siteKey", IsRequired = false)]
        public virtual string SiteKey {
            get { return (string)base["siteKey"]; }
            set { base["siteKey"] = value; }
        }

        [ConfigurationProperty("secretKey", IsRequired = false)]
        public virtual string SecretKey
        {
            get { return (string)base["secretKey"]; }
            set { base["secretKey"] = value; }
        }

        [ConfigurationProperty("numberOfFailedAttempts", IsRequired = false)]
        public virtual int NumberOfFailedAttempts
        {
            get { return (int)base["numberOfFailedAttempts"]; }
            set { base["numberOfFailedAttempts"] = value; }
        }

        [ConfigurationProperty("resetPeriodInHours", IsRequired = false)]
        public virtual int ResetPeriodInHours
        {
            get { return (int)base["resetPeriodInHours"]; }
            set { base["resetPeriodInHours"] = value; }
        }

        [ConfigurationProperty("verifyUrl", IsRequired = false)]
        public virtual string VerifyUrl
        {
            get { return (string)base["verifyUrl"]; }
            set { base["verifyUrl"] = value; }
        }
    }
}