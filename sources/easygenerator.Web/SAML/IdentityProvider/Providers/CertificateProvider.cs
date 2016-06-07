using System.IdentityModel.Metadata;
using System.IdentityModel.Tokens;
using System.Security.Cryptography.X509Certificates;
using System.Web;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.SAML.IdentityProvider.Providers
{
    public class CertificateProvider: ICertificateProvider
    {
        public CertificateProvider(ConfigurationReader configurationReader)
        {
            // The X509KeyStorageFlags.MachineKeySet flag is required when loading a
            // certificate from file on a shared hosting solution such as Azure.
            SigningCertificate = new X509Certificate2(HttpContext.Current.Server.MapPath(configurationReader.SamlIdPConfiguration.CertificatePath),
                configurationReader.SamlIdPConfiguration.CertificatePassword ?? "", X509KeyStorageFlags.MachineKeySet);
            SigningKey = new KeyDescriptor(new SecurityKeyIdentifier(new X509SecurityToken(SigningCertificate).CreateKeyIdentifierClause<X509RawDataKeyIdentifierClause>()));
        }

        public X509Certificate2 SigningCertificate { get; }
        public KeyDescriptor SigningKey { get; }
    }
}
