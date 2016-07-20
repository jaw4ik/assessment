using System.Configuration;

namespace easygenerator.Web.Components.Configuration.SAML
{
    public class SamlIdPConfigurationSection : ConfigurationSection
    {
        [ConfigurationProperty("rootPath", IsRequired = true)]
        public string RootPath
        {
            get { return (string)this["rootPath"]; }
            set { this["rootPath"] = value; }
        }

        [ConfigurationProperty("ssoServicePath", IsRequired = true)]
        public virtual string SsoServicePath
        {
            get { return (string)this["ssoServicePath"]; }
            set { this["ssoServicePath"] = value; }
        }

        [ConfigurationProperty("metadataPath", IsRequired = true)]
        public virtual string MetadataPath
        {
            get { return (string)this["metadataPath"]; }
            set { this["metadataPath"] = value; }
        }

        [ConfigurationProperty("logoutServicePath", IsRequired = false)]
        public virtual string LogoutServicePath
        {
            get { return (string)this["logoutServicePath"]; }
            set { this["logoutServicePath"] = value; }
        }

        [ConfigurationProperty("certificatePath", IsRequired = true)]
        public virtual string CertificatePath
        {
            get { return (string)this["certificatePath"]; }
            set { this["certificatePath"] = value; }
        }

        [ConfigurationProperty("certificatePassword", IsRequired = false)]
        public virtual string CertificatePassword
        {
            get { return (string)this["certificatePassword"]; }
            set { this["certificatePassword"] = value; }
        }

        [ConfigurationProperty("metadata", IsRequired = true)]
        public virtual MetadataElement Metadata
        {
            get { return (MetadataElement)(base["metadata"]); }
            set { base["metadata"] = value; }
        }

        [ConfigurationProperty("organization", IsRequired = true)]
        public virtual OrganizationElement Organization
        {
            get { return (OrganizationElement)(base["organization"]); }
            set { base["organization"] = value; }
        }

        [ConfigurationProperty("contacts", IsRequired = true)]
        public virtual ContactCollection Contacts
        {
            get { return (ContactCollection)(base["contacts"]); }
            set { base["contacts"] = value; }
        }

        [ConfigurationProperty("wantAuthenticationRequestsSigned", IsRequired = true)]
        public virtual bool WantAuthenticationRequestsSigned
        {
            get { return (bool)this["wantAuthenticationRequestsSigned"]; }
            set { this["wantAuthenticationRequestsSigned"] = value; }
        }
    }
}