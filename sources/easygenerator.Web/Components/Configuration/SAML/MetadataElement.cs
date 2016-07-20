using System.Configuration;

namespace easygenerator.Web.Components.Configuration.SAML
{
    public class MetadataElement : ConfigurationElement
    {
        [ConfigurationProperty("validPeriodDays", IsRequired = true)]
        public int ValidPeriodDays
        {
            get { return (int)base["validPeriodDays"]; }
            set { base["validPeriodDays"] = value; }
        }

        [ConfigurationProperty("cacheDays", IsRequired = true)]
        public int CacheDays
        {
            get { return (int)base["cacheDays"]; }
            set { base["cacheDays"] = value; }
        }

        [ConfigurationProperty("cacheHours", IsRequired = true)]
        public int CacheHours
        {
            get { return (int)base["cacheHours"]; }
            set { base["cacheHours"] = value; }
        }

        [ConfigurationProperty("cacheMinutes", IsRequired = true)]
        public int CacheMinutes
        {
            get { return (int)base["cacheMinutes"]; }
            set { base["cacheMinutes"] = value; }
        }
    }
}