using System.Configuration;

namespace easygenerator.Web.Components.Configuration.ExternalApi
{
    public class ExternalApiSection : ConfigurationSection
    {
        [ConfigurationProperty("apiKeys", IsRequired = true)]
        public ApiKeyCollection ApiKeys
        {
            get { return ((ApiKeyCollection)(base["apiKeys"])); }
            set { base["apiKeys"] = value; }
        }
    }
}