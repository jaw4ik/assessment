using System.Configuration;

namespace easygenerator.Web.Components.Configuration
{
    public class FileStorageConfigurationSection : ConfigurationSection
    {
        [ConfigurationProperty("MaximumFileSize", DefaultValue = "10485760", IsRequired = true)]
        [LongValidator(MinValue = 1)]
        public long MaximumFileSize
        {
            get
            {
                return (long)this["MaximumFileSize"];
            }
            set
            {
                this["MaximumFileSize"] = value;
            }
        }

        [ConfigurationProperty("Path", IsRequired = true)]
        public string Path
        {
            get
            {
                return (string)this["Path"];
            }
            set
            {
                this["Path"] = value;
            }
        }

        [ConfigurationProperty("Url", IsRequired = true)]
        public string Url
        {
            get
            {
                return (string)this["Url"];
            }
            set
            {
                this["Url"] = value;
            }
        }
    }
}