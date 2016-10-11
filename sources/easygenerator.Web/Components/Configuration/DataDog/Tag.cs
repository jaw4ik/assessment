using System.Configuration;

namespace easygenerator.Web.Components.Configuration.DataDog
{
    public class Tag: ConfigurationElement
    {
        public Tag() { }
        public Tag(string name)
        {
            Name = name;
        }

        [ConfigurationProperty("name", IsRequired = true, IsKey = true)]
        public string Name
        {
            get { return (string)this["name"]; }
            set { this["name"] = value; }
        }
    }
}