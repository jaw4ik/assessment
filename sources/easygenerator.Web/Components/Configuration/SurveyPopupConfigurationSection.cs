using System.Configuration;

namespace easygenerator.Web.Components.Configuration
{
    public class SurveyPopupConfigurationSection : ConfigurationSection
    {

        [ConfigurationProperty("originUrl", IsRequired = true)]
        public string OriginUrl
        {
            get
            {
                return (string)this["originUrl"];
            }
            set
            {
                this["originUrl"] = value;
            }
        }

        [ConfigurationProperty("pageUrl", IsRequired = true)]
        public string PageUrl
        {
            get
            {
                return (string)this["pageUrl"];
            }
            set
            {
                this["pageUrl"] = value;
            }
        }

        [ConfigurationProperty("version", IsRequired = true)]
        public string Version
        {
            get
            {
                return (string)this["version"];
            }
            set
            {
                this["version"] = value;
            }
        }
    }
}