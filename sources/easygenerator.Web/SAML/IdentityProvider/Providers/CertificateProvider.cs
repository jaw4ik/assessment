using System.IdentityModel.Metadata;
using System.Security.Cryptography.X509Certificates;
using System.Web;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.SAML.IdentityProvider.Providers
{
    public class CertificateProvider: ICertificateProvider
    {
        public CertificateProvider(HttpContextBase httpContext, ConfigurationReader configurationReader, IX509CertificateProvider x509CertificateProvider)
        {
            SigningCertificate = x509CertificateProvider.Create(httpContext.Server.MapPath(configurationReader.SamlIdPConfiguration.CertificatePath),
                configurationReader.SamlIdPConfiguration.CertificatePassword);
            SigningKey = x509CertificateProvider.Create(x509CertificateProvider.Create(x509CertificateProvider.Create(SigningCertificate)));
        }

        public X509Certificate2 SigningCertificate { get; }
        public KeyDescriptor SigningKey { get; }
    }
}
