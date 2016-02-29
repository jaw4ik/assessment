using System.Configuration;

namespace easygenerator.Web.Components.Configuration
{
    public class IntercomConfigurationSection : ConfigurationSection
    {
        [ConfigurationProperty("serviceUrl", IsRequired = true)]
        public string ServiceUrl
        {
            get
            {
                return (string)this["serviceUrl"];
            }
            set
            {
                this["serviceUrl"] = value;
            }
        }

        [ConfigurationProperty("appId", IsRequired = true)]
        public string AppId
        {
            get
            {
                return (string)this["appId"];
            }
            set
            {
                this["appId"] = value;
            }
        }

        [ConfigurationProperty("apiKey", IsRequired = true)]
        public string ApiKey
        {
            get
            {
                return (string)this["apiKey"];
            }
            set
            {
                this["apiKey"] = value;
            }
        }
    }
}