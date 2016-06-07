using System.IdentityModel.Metadata;
using System.Security.Cryptography.X509Certificates;

namespace easygenerator.Web.SAML.IdentityProvider.Providers
{
    public interface ICertificateProvider
    {
        X509Certificate2 SigningCertificate { get; }
        KeyDescriptor SigningKey { get; }
    }
}