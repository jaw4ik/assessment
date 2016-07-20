using System.IdentityModel.Metadata;
using System.Security.Cryptography.X509Certificates;
using System.IdentityModel.Tokens;
using System.Web;
using easygenerator.Web.Components.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using easygenerator.Web.Components.Configuration.SAML;
using easygenerator.Web.SAML.IdentityProvider.Providers;
using FluentAssertions;

namespace easygenerator.Web.Tests.SAML.IdentityProvider
{
    [TestClass]
    public class CertificateProviderTests
    {
        private HttpContextBase _context;
        private ConfigurationReader _configurationReader;
        private IX509CertificateProvider _x509CertificateProvider;

        private SamlIdPConfigurationSection _samlIdPConfigurationSection;
        private X509Certificate2 _cert;
        private X509SecurityToken _token;
        private SecurityKeyIdentifier _identifier;
        private KeyDescriptor _keyDescriptor;

        [TestInitialize]
        public void InitializeContext()
        {
            _configurationReader = Substitute.For<ConfigurationReader>();
            _samlIdPConfigurationSection = new SamlIdPConfigurationSection();
            _samlIdPConfigurationSection.CertificatePath = "~/SAML/IdentityProvider/Certificates/easygenerator.saml.idp.pfx";
            _samlIdPConfigurationSection.CertificatePassword = "easygenerator";
            _configurationReader.SamlIdPConfiguration.Returns(_samlIdPConfigurationSection);

            _context = Substitute.For<HttpContextBase>();
            var server = Substitute.For<HttpServerUtilityBase>();
            server.MapPath(_samlIdPConfigurationSection.CertificatePath).Returns(_samlIdPConfigurationSection.CertificatePath);
            _context.Server.Returns(server);

            _x509CertificateProvider = Substitute.For<IX509CertificateProvider>();
            _cert = new X509Certificate2();
            _token = new X509SecurityToken(_cert);
            _identifier = new SecurityKeyIdentifier();
            _keyDescriptor = new KeyDescriptor();
            _x509CertificateProvider.Create(_samlIdPConfigurationSection.CertificatePath, _samlIdPConfigurationSection.CertificatePassword).Returns(_cert);
            _x509CertificateProvider.Create(_cert).Returns(_token);
            _x509CertificateProvider.Create(_token).Returns(_identifier);
            _x509CertificateProvider.Create(_identifier).Returns(_keyDescriptor);
        }

        [TestMethod]
        public void Ctor_ShouldMapCertificatePath()
        {
            var certificateProvider = new CertificateProvider(_context, _configurationReader, _x509CertificateProvider);
            _context.Server.Received().MapPath(_samlIdPConfigurationSection.CertificatePath);
        }

        [TestMethod]
        public void Ctor_ShouldCreateSigningCertificate()
        {
            var certificateProvider = new CertificateProvider(_context, _configurationReader, _x509CertificateProvider);
            _x509CertificateProvider.Received().Create(_samlIdPConfigurationSection.CertificatePath, _samlIdPConfigurationSection.CertificatePassword);
            certificateProvider.SigningCertificate.Should().Be(_cert);
        }

        [TestMethod]
        public void Ctor_ShouldCreateSigningKey()
        {
            var certificateProvider = new CertificateProvider(_context, _configurationReader, _x509CertificateProvider);
            _x509CertificateProvider.Received().Create(_cert);
            _x509CertificateProvider.Received().Create(_token);
            _x509CertificateProvider.Received().Create(_identifier);
            certificateProvider.SigningKey.Should().Be(_keyDescriptor);
        }

        [TestMethod]
        public void SigningCertificate_ShouldReturnAppropriateCertificate()
        {
            var certificateProvider = new CertificateProvider(_context, _configurationReader, _x509CertificateProvider);
            certificateProvider.SigningCertificate.Should().Be(_cert);
        }

        [TestMethod]
        public void SigningKey_ShouldReturnAppropriateKey()
        {
            var certificateProvider = new CertificateProvider(_context, _configurationReader, _x509CertificateProvider);
            certificateProvider.SigningKey.Should().Be(_keyDescriptor);
        }
    }
}
