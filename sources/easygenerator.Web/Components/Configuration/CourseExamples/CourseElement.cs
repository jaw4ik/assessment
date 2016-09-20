using System.Configuration;
using System.IdentityModel.Metadata;

namespace easygenerator.Web.Components.Configuration.CourseExamples
{
    public class CourseElement : ConfigurationElement
    {
        [ConfigurationProperty("id", IsRequired = true)]
        public string Id
        {
            get { return (string)base["id"]; }
            set { base["id"] = value; }
        }

        [ConfigurationProperty("category", IsRequired = true)]
        public string Category
        {
            get { return (string)base["category"]; }
            set { base["category"] = value; }
        }

        [ConfigurationProperty("imageUrl", IsRequired = true)]
        public string ImageUrl
        {
            get { return (string)base["imageUrl"]; }
            set { base["imageUrl"] = value; }
        }
    }
}