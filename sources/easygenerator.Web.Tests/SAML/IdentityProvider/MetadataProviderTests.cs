using System;
using System.IdentityModel.Metadata;
using System.Linq;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using easygenerator.Web.Components.Configuration.SAML;
using easygenerator.Web.SAML.IdentityProvider.Providers;
using FluentAssertions;
using Kentor.AuthServices.WebSso;

namespace easygenerator.Web.Tests.SAML.IdentityProvider
{
    [TestClass]
    public class MetadataProviderTests
    {
        private ConfigurationReader _configurationReader;
        private SamlIdPConfigurationSection _configurationSection;
        private ICertificateProvider _certificateProvider;
        private IUrlResolverProvider _urlResolverProvider;
        private IMetadataProvider _metadataProvider;

        [TestInitialize]
        public void InitializeContext()
        {
            DateTimeWrapper.Now = () => new DateTime(2016, 4, 7);
            _configurationReader = Substitute.For<ConfigurationReader>();
            _configurationSection = new SamlIdPConfigurationSection();
            _configurationSection.Organization = new OrganizationElement()
            {
                Name = "easygenerator",
                DisplayName = "easygenerator",
                Url = "https://www.easygenerator.com"
            };
            _configurationSection.Contacts = new ContactCollection();
            _configurationSection.Metadata = new MetadataElement()
            {
                CacheDays = 1,
                CacheHours = 0,
                CacheMinutes = 0,
                ValidPeriodDays = 1
            };
            _configurationSection.WantAuthenticationRequestsSigned = false;
            _configurationReader.SamlIdPConfiguration.Returns(_configurationSection);

            _certificateProvider = Substitute.For<ICertificateProvider>();
            _certificateProvider.SigningKey.Returns(new KeyDescriptor());

            _urlResolverProvider = Substitute.For<IUrlResolverProvider>();
            _urlResolverProvider.MetadataUrl.Returns(new Uri("http://localhost:666/saml/idp"));
            _urlResolverProvider.SsoServiceUrl.Returns(new Uri("http://localhost:666/saml/idp/Auth"));
            _urlResolverProvider.LogoutServiceUrl.Returns(new Uri("http://localhost:666/saml/idp/Logout"));

            _metadataProvider = new MetadataProvider(_configurationReader, _certificateProvider, _urlResolverProvider);
        }

        [TestMethod]
        public void GetIdpMetadata_ShouldReturnAppropriateMetadata_WhenIncludeCacheParameterIsNotSet()
        {
            var metadata = _metadataProvider.GetIdpMetadata();
            metadata.CacheDuration.Value.Days.Should().Be(_configurationSection.Metadata.CacheDays);
            metadata.CacheDuration.Value.Hours.Should().Be(_configurationSection.Metadata.CacheHours);
            metadata.CacheDuration.Value.Minutes.Should().Be(_configurationSection.Metadata.CacheMinutes);
            metadata.ValidUntil.Value.Day.Should().Be(8);
            metadata.ValidUntil.Value.Month.Should().Be(4);
            metadata.ValidUntil.Value.Year.Should().Be(2016);
            metadata.EntityId.Id.Should().Be("http://localhost:666/saml/idp");
            metadata.Organization.Names[0].Name.Should().Be(_configurationSection.Organization.Name);
            metadata.Organization.DisplayNames[0].Name.Should().Be(_configurationSection.Organization.DisplayName);
            metadata.Organization.Urls[0].Uri.OriginalString.Should().Be(_configurationSection.Organization.Url);
            metadata.Contacts.Count.Should().Be(0);
            metadata.RoleDescriptors.Count.Should().Be(1);
            metadata.RoleDescriptors.First().ProtocolsSupported.First().OriginalString.Should().Be("urn:oasis:names:tc:SAML:2.0:protocol");
            ((IdentityProviderSingleSignOnDescriptor)metadata.RoleDescriptors.First()).WantAuthenticationRequestsSigned
                .Should().Be(_configurationSection.WantAuthenticationRequestsSigned);
            ((IdentityProviderSingleSignOnDescriptor)metadata.RoleDescriptors.First()).SingleSignOnServices.First().Binding.Should().Be(Saml2Binding.HttpRedirectUri);
            ((IdentityProviderSingleSignOnDescriptor)metadata.RoleDescriptors.First()).SingleSignOnServices.First().Location.Should().Be(_urlResolverProvider.SsoServiceUrl);
            metadata.RoleDescriptors.First().Keys.First().Should().Be(_certificateProvider.SigningKey);
        }

        [TestMethod]
        public void GetIdpMetadata_ShouldReturnAppropriateMetadata_WhenIncludeCacheParameterIsSet()
        {
            var metadata = _metadataProvider.GetIdpMetadata(false);
            metadata.CacheDuration.Should().Be(null);
            metadata.ValidUntil.Should().Be(null);
            metadata.EntityId.Id.Should().Be("http://localhost:666/saml/idp");
            metadata.Organization.Names[0].Name.Should().Be(_configurationSection.Organization.Name);
            metadata.Organization.DisplayNames[0].Name.Should().Be(_configurationSection.Organization.DisplayName);
            metadata.Organization.Urls[0].Uri.OriginalString.Should().Be(_configurationSection.Organization.Url);
            metadata.Contacts.Count.Should().Be(0);
            metadata.RoleDescriptors.Count.Should().Be(1);
            metadata.RoleDescriptors.First().ProtocolsSupported.First().OriginalString.Should().Be("urn:oasis:names:tc:SAML:2.0:protocol");
            ((IdentityProviderSingleSignOnDescriptor)metadata.RoleDescriptors.First()).WantAuthenticationRequestsSigned
                .Should().Be(_configurationSection.WantAuthenticationRequestsSigned);
            ((IdentityProviderSingleSignOnDescriptor)metadata.RoleDescriptors.First()).SingleSignOnServices.First().Binding.Should().Be(Saml2Binding.HttpRedirectUri);
            ((IdentityProviderSingleSignOnDescriptor)metadata.RoleDescriptors.First()).SingleSignOnServices.First().Location.Should().Be(_urlResolverProvider.SsoServiceUrl);
            metadata.RoleDescriptors.First().Keys.First().Should().Be(_certificateProvider.SigningKey);
        }
    }
}
