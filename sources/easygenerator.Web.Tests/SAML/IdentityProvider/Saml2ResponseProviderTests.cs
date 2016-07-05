using System;
using System.IdentityModel.Claims;
using System.Security.Cryptography.X509Certificates;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using easygenerator.Web.SAML.IdentityProvider.Models;
using easygenerator.Web.SAML.IdentityProvider.Providers;
using FluentAssertions;

namespace easygenerator.Web.Tests.SAML.IdentityProvider
{
    [TestClass]
    public class Saml2ResponseProviderTests
    {
        private ICertificateProvider _certificateProvider;
        private IUrlResolverProvider _urlResolverProvider;
        private AssertionModel _assertionModel;
        private ISaml2ResponseProvider _saml2ResponseProvider;

        [TestInitialize]
        public void InitializeContext()
        {
            _certificateProvider = Substitute.For<ICertificateProvider>();
            _certificateProvider.SigningCertificate.Returns(new X509Certificate2());
            _urlResolverProvider = Substitute.For<IUrlResolverProvider>();
            _urlResolverProvider.MetadataUrl.Returns(new Uri("http://localhost:666/saml/idp"));

            _saml2ResponseProvider = new Saml2ResponseProvider(_certificateProvider, _urlResolverProvider);

            _assertionModel = new AssertionModel()
            {
                AssertionConsumerServiceUrl = "http://localhost:666/saml/sp/Acs",
                Audience = "http://localhost:666/saml/idp",
                NameId = "http://localhost:666/saml/idp",
                InResponseTo = "_djkdsjfk-dfsf-dsfsdf-dfdfd",
                RelayState = "_rdfdgsfkhgsjdfhagdlkfhlkjdsfhdshafsdkjfhalkjsdhflkashdklfj"
            };
            _assertionModel.AttributeStatements.Add(new AttributeStatementModel()
            {
                Type = ClaimTypes.GivenName,
                Value = "Team Leader"
            });
        }

        [TestMethod]
        public void CreateSaml2Response_ShouldThrowIfAssertionModelIsNull()
        {
            Action action = () => _saml2ResponseProvider.CreateSaml2Response(null);
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("assertionModel");
        }

        [TestMethod]
        public void CreateSaml2Response_ShouldCreateSaml2Response()
        {
            var saml2Response = _saml2ResponseProvider.CreateSaml2Response(_assertionModel);
            saml2Response.Issuer.Id.Should().Be(_assertionModel.Audience);
            saml2Response.DestinationUrl.OriginalString.Should().Be(_assertionModel.AssertionConsumerServiceUrl);
            saml2Response.InResponseTo.Value.Should().Be(_assertionModel.InResponseTo);
            saml2Response.RelayState.Should().Be(_assertionModel.RelayState);
        }
    }
}
