using System.Collections;
using System.Configuration;

namespace easygenerator.Web.Components.Configuration.ExternalApi
{
    public class ExternalApiSection : ConfigurationSection
    {
        [ConfigurationProperty("apiKeys", IsRequired = true)]
        public virtual ICollection ApiKeys
        {
            get { return ((ApiKeyCollection)(base["apiKeys"])); }
            set { base["apiKeys"] = value; }
        }
    }
}