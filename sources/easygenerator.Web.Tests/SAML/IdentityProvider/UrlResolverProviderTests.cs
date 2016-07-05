using System;
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
    public class UrlResolverProviderTests
    {
        private HttpContextBase _context;
        private ConfigurationReader _configurationReader;
        private SamlIdPConfigurationSection _samlIdPConfigurationSection;
        private IUrlResolverProvider _urlResolverProvider;

        private const string appUrl = "http://localhost:666";
        private const string url = appUrl + "/saml/idp";

        [TestInitialize]
        public void InitializeContext()
        {
            _configurationReader = Substitute.For<ConfigurationReader>();
            _samlIdPConfigurationSection = new SamlIdPConfigurationSection();
            _samlIdPConfigurationSection.RootPath = "/saml/idp";
            _samlIdPConfigurationSection.SsoServicePath = "/saml/idp/Auth";
            _samlIdPConfigurationSection.MetadataPath = "/saml/idp";
            _samlIdPConfigurationSection.LogoutServicePath = "/saml/idp/Logout";
            _configurationReader.SamlIdPConfiguration.Returns(_samlIdPConfigurationSection);

            _context = Substitute.For<HttpContextBase>();
            var request = Substitute.For<HttpRequestBase>();
            request.Url.Returns(new Uri(url));
            request.ApplicationPath.Returns("");
            _context.Request.Returns(request);

            _urlResolverProvider = new UrlResolverProvider(_context, _configurationReader);
        }

        [TestMethod]
        public void RootUrl_ShouldReturnRootUrl()
        {
            var rootUrl = _urlResolverProvider.RootUrl;
            rootUrl.OriginalString.Should().Be(url);
        }

        [TestMethod]
        public void SsoServiceUrl_ShouldReturnSsoServiceUrl()
        {
            var ssoUrl = _urlResolverProvider.SsoServiceUrl;
            ssoUrl.OriginalString.Should().Be(appUrl + _samlIdPConfigurationSection.SsoServicePath);
        }

        [TestMethod]
        public void MetadataUrl_ShouldReturnMetadataUrl()
        {
            var matadataUrl = _urlResolverProvider.MetadataUrl;
            matadataUrl.OriginalString.Should().Be(appUrl + _samlIdPConfigurationSection.MetadataPath);
        }

        [TestMethod]
        public void LogoutServiceUrl_ShouldReturnLogoutServiceUrl()
        {
            var logoutUrl = _urlResolverProvider.LogoutServiceUrl;
            logoutUrl.OriginalString.Should().Be(appUrl + _samlIdPConfigurationSection.LogoutServicePath);
        }
    }
}
