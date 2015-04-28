using System.Configuration;

namespace easygenerator.Web.Components.Configuration
{
    public class CourseImportConfigurationSection : ConfigurationSection
    {
        [ConfigurationProperty("presentationMaximumFileSize", DefaultValue = "10485760", IsRequired = true)]
        [LongValidator(MinValue = 1)]
        public long PresentationMaximumFileSize
        {
            get
            {
                return (long)this["presentationMaximumFileSize"];
            }
            set
            {
                this["presentationMaximumFileSize"] = value;
            }
        }
    }
}