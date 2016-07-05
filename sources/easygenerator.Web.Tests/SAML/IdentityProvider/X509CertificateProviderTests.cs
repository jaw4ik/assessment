using System;
using System.Security.Cryptography.X509Certificates;
using System.IdentityModel.Tokens;
using easygenerator.Infrastructure;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using easygenerator.Web.SAML.IdentityProvider.Providers;
using FluentAssertions;

namespace easygenerator.Web.Tests.SAML.IdentityProvider
{
    [TestClass]
    public class X509CertificateProviderTests
    {
        private PhysicalFileManager _fileManager;

        private X509Certificate2 _cert;
        private SecurityKeyIdentifier _identifier;

        private const string Path = "~/SAML/IdentityProvider/Certificates/easygenerator.saml.idp.pfx";
        private const string Password = "easygenerator";

        [TestInitialize]
        public void InitializeContext()
        {
            _fileManager = Substitute.For<PhysicalFileManager>();
            _cert = new X509Certificate2();
            _identifier = new SecurityKeyIdentifier();
        }

        [TestMethod]
        public void Create_WhenArgsArePathAndPassword_ShouldThrowIfPathDoesNotExist()
        {
            _fileManager.FileExists(Path).Returns(false);
            var x509CertificateProvider = new X509CertificateProvider(_fileManager);
            Action action = () => x509CertificateProvider.Create(Path, Password);
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("certPath");
        }

        [TestMethod]
        public void Create_WhenArgIsX509Certificate2_ShouldThrowIfArgIsNull()
        {
            var x509CertificateProvider = new X509CertificateProvider(_fileManager);
            X509Certificate2 cert = null;
            Action action = () => x509CertificateProvider.Create(cert);
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("x509Certificate");
        }

        [TestMethod]
        public void Create_WhenArgIsX509Certificate2_ShouldCreateCertificateIfArgIsNotNull()
        {
            var x509CertificateProvider = new X509CertificateProvider(_fileManager);
            var cert = x509CertificateProvider.Create(_cert);
            cert.Should().NotBeNull();
        }

        [TestMethod]
        public void Create_WhenArgIsX509SecurityToken_ShouldThrowIfArgIsNull()
        {
            var x509CertificateProvider = new X509CertificateProvider(_fileManager);
            X509SecurityToken token = null;
            Action action = () => x509CertificateProvider.Create(token);
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("x509SecurityToken");
        }

        [TestMethod]
        public void Create_WhenArgIsSecurityKeyIdentifier_ShouldThrowIfArgIsNull()
        {
            var x509CertificateProvider = new X509CertificateProvider(_fileManager);
            SecurityKeyIdentifier identifier = null;
            Action action = () => x509CertificateProvider.Create(identifier);
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("securityKeyIdentifier");
        }

        [TestMethod]
        public void Create_WhenArgIsSecurityKeyIdentifier_ShouldCreateKeyDescriptorIfArgIsNotNull()
        {
            var x509CertificateProvider = new X509CertificateProvider(_fileManager);
            var keyDescriptor = x509CertificateProvider.Create(_identifier);
            keyDescriptor.Should().NotBeNull();
        }
    }
}
