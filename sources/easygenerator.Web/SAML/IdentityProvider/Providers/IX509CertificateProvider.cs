using System.IdentityModel.Metadata;
using System.IdentityModel.Tokens;
using System.Security.Cryptography.X509Certificates;

namespace easygenerator.Web.SAML.IdentityProvider.Providers
{
    public interface IX509CertificateProvider
    {
        X509Certificate2 Create(string path, string password);
        X509SecurityToken Create(X509Certificate2 cert);
        SecurityKeyIdentifier Create(X509SecurityToken x509SecurityToken);
        KeyDescriptor Create(SecurityKeyIdentifier securityKeyIdentifier);
    }
}