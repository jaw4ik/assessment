using System;
using System.IdentityModel.Metadata;
using System.IdentityModel.Tokens;
using System.Security.Cryptography.X509Certificates;
using easygenerator.Infrastructure;

namespace easygenerator.Web.SAML.IdentityProvider.Providers
{
    public class X509CertificateProvider: IX509CertificateProvider
    {
        private readonly PhysicalFileManager _fileManager;
        public X509CertificateProvider(PhysicalFileManager fileManager)
        {
            _fileManager = fileManager;
        }

        // The X509KeyStorageFlags.MachineKeySet flag is required when loading a
        // certificate from file on a shared hosting solution such as Azure.
        public X509Certificate2 Create(string certPath, string password = "")
        {
            if (!_fileManager.FileExists(certPath))
            {
                throw new ArgumentNullException(nameof(certPath));
            }
            return new X509Certificate2(certPath, password, X509KeyStorageFlags.MachineKeySet);
        }

        public X509SecurityToken Create(X509Certificate2 x509Certificate)
        {
            ArgumentValidation.ThrowIfNull(x509Certificate, nameof(x509Certificate));
            return new X509SecurityToken(x509Certificate);
        }

        public SecurityKeyIdentifier Create(X509SecurityToken x509SecurityToken)
        {
            ArgumentValidation.ThrowIfNull(x509SecurityToken, nameof(x509SecurityToken));
            return new SecurityKeyIdentifier(x509SecurityToken.CreateKeyIdentifierClause<X509RawDataKeyIdentifierClause>());
        }

        public KeyDescriptor Create(SecurityKeyIdentifier securityKeyIdentifier)
        {
            ArgumentValidation.ThrowIfNull(securityKeyIdentifier, nameof(securityKeyIdentifier));
            return new KeyDescriptor(securityKeyIdentifier);
        }

    }
}