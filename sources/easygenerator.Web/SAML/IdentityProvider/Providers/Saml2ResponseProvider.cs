using System;
using System.IdentityModel.Metadata;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Security.Claims;
using easygenerator.Web.SAML.IdentityProvider.Models;
using Kentor.AuthServices;
using Kentor.AuthServices.Saml2P;

namespace easygenerator.Web.SAML.IdentityProvider.Providers
{
    public class Saml2ResponseProvider: ISaml2ResponseProvider
    {
        private readonly ICertificateProvider _certificateProvider;
        private readonly IUrlResolverProvider _urlResolverProvider;

        public Saml2ResponseProvider(ICertificateProvider certificateProvider, IUrlResolverProvider urlResolverProvider)
        {
            _certificateProvider = certificateProvider;
            _urlResolverProvider = urlResolverProvider;
        }

        public Saml2Response CreateSaml2Response(AssertionModel assertionModel)
        {
            if (assertionModel == null)
            {
                throw new ArgumentNullException(nameof(assertionModel));
            }
            var nameIdClaim = new Claim(ClaimTypes.NameIdentifier, assertionModel.NameId, ClaimValueTypes.Email);
            nameIdClaim.Properties[ClaimProperties.SamlNameIdentifierFormat] = NameIdFormat.EmailAddress.GetUri().AbsoluteUri;
            var attributeClaims = assertionModel.AttributeStatements.Select(attr => new Claim(attr.Type, attr.Value));
            var claims = new Claim[] { nameIdClaim }.Concat(attributeClaims);

            var identity = new ClaimsIdentity(claims);
            var issuer = new EntityId(_urlResolverProvider.MetadataUrl.ToString());
            var issuerCertificate = _certificateProvider.SigningCertificate;
            var destinationUrl = new Uri(assertionModel.AssertionConsumerServiceUrl);
            var saml2Id = string.IsNullOrEmpty(assertionModel.InResponseTo) ? null : new Saml2Id(assertionModel.InResponseTo);
            var relayState = assertionModel.RelayState;
            var audienceUrl = string.IsNullOrEmpty(assertionModel.Audience) ? null : new Uri(assertionModel.Audience);

            return new Saml2Response(issuer, issuerCertificate, destinationUrl, saml2Id, relayState, audienceUrl, identity);
        }
    }
}