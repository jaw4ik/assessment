using System;
using System.Globalization;
using System.IdentityModel.Metadata;
using System.Linq;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Components.Configuration.SAML;
using Kentor.AuthServices.Metadata;
using Kentor.AuthServices.WebSso;

namespace easygenerator.Web.SAML.IdentityProvider.Providers
{
    public class MetadataProvider : IMetadataProvider
    {
        private readonly SamlIdPConfigurationSection _configurationSection;
        private readonly ICertificateProvider _certificateProvider;
        private readonly IUrlResolverProvider _urlResolverProvider;
        private readonly ExtendedEntityDescriptor _metadata;

        public MetadataProvider(ConfigurationReader configurationReader, ICertificateProvider certificateProvider, IUrlResolverProvider urlResolverProvider)
        {
            _configurationSection = configurationReader.SamlIdPConfiguration;
            _certificateProvider = certificateProvider;
            _urlResolverProvider = urlResolverProvider;
            _metadata = BuildIdpMetadata(false);
        }

        public ExtendedEntityDescriptor GetIdpMetadata(bool includeCacheDuration = true)
        {
            return includeCacheDuration ? BuildIdpMetadata() : _metadata;
        }

        private ExtendedEntityDescriptor BuildIdpMetadata(bool includeCacheDuration = true)
        {
            var entityId = new EntityId(_urlResolverProvider.MetadataUrl.ToString());
            var organization = new Organization()
            {
                Names = { new LocalizedName(_configurationSection.Organization.Name, CultureInfo.CurrentCulture) },
                DisplayNames = { new LocalizedName(_configurationSection.Organization.DisplayName, CultureInfo.CurrentCulture) },
                Urls = { new LocalizedUri(new Uri(_configurationSection.Organization.Url), CultureInfo.CurrentCulture) }
            };
            var contacts = (from ContactElement contact in _configurationSection.Contacts
                select new ContactPerson()
                {
                    Type = contact.Type,
                    Company = contact.Company,
                    GivenName = contact.GivenName,
                    Surname = contact.Surname,
                    EmailAddresses = {contact.EmailAddress}
                }).ToList();
            var cacheDuration = new TimeSpan(_configurationSection.Metadata.CacheDays,
                _configurationSection.Metadata.CacheHours, _configurationSection.Metadata.CacheMinutes);

            var metadata = new ExtendedEntityDescriptor()
            {
                EntityId = entityId,
                Organization = organization
            };
            contacts.ForEach(contact => metadata.Contacts.Add(contact));

            if (includeCacheDuration)
            {
                metadata.CacheDuration = cacheDuration;
                metadata.ValidUntil = DateTime.UtcNow.AddDays(_configurationSection.Metadata.ValidPeriodDays);
            }

            var idpSsoDescriptor = new IdentityProviderSingleSignOnDescriptor()
            {
                WantAuthenticationRequestsSigned = _configurationSection.WantAuthenticationRequestsSigned
            };

            idpSsoDescriptor.ProtocolsSupported.Add(new Uri("urn:oasis:names:tc:SAML:2.0:protocol"));
            metadata.RoleDescriptors.Add(idpSsoDescriptor);

            idpSsoDescriptor.SingleSignOnServices.Add(new ProtocolEndpoint()
            {
                Binding = Saml2Binding.HttpRedirectUri,
                Location = _urlResolverProvider.SsoServiceUrl
            });

            if (_urlResolverProvider.LogoutServiceUrl != null)
            {
                idpSsoDescriptor.SingleLogoutServices.Add(new ProtocolEndpoint()
                {
                    Binding = Saml2Binding.HttpRedirectUri,
                    Location = _urlResolverProvider.LogoutServiceUrl
                });

                idpSsoDescriptor.SingleLogoutServices.Add(new ProtocolEndpoint()
                {
                    Binding = Saml2Binding.HttpPostUri,
                    Location = _urlResolverProvider.LogoutServiceUrl
                });
            }

            idpSsoDescriptor.Keys.Add(_certificateProvider.SigningKey);

            return metadata;
        }
    }
}