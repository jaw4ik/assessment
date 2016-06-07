using System.Configuration;
using System.IdentityModel.Metadata;

namespace easygenerator.Web.Components.Configuration.SAML
{
    public class ContactElement : ConfigurationElement
    {
        [ConfigurationProperty("type", IsRequired = true)]
        public ContactType Type
        {
            get { return (ContactType)base["type"]; }
            set { base["type"] = value; }
        }

        [ConfigurationProperty("company", IsRequired = true)]
        public string Company
        {
            get { return (string)base["company"]; }
            set { base["company"] = value; }
        }

        [ConfigurationProperty("givenName", IsRequired = true)]
        public string GivenName
        {
            get { return (string)base["givenName"]; }
            set { base["givenName"] = value; }
        }

        [ConfigurationProperty("surname", IsRequired = true)]
        public string Surname
        {
            get { return (string)base["surname"]; }
            set { base["surname"] = value; }
        }

        [ConfigurationProperty("emailAddress", IsRequired = true)]
        public string EmailAddress
        {
            get { return (string)base["emailAddress"]; }
            set { base["emailAddress"] = value; }
        }
    }
}