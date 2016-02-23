using System.Configuration;

namespace easygenerator.Auth.ConfigurationSections
{
    public class CryptographySection : ConfigurationSection
    {
        [ConfigurationPropertyAttribute("secret", IsRequired = true)]
        public virtual string Secret
        {
            get { return (string)base["secret"]; }
            set { base["secret"] = value; }
        }
    }
}
