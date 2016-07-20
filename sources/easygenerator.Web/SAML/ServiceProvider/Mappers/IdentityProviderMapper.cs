using System;
using System.IdentityModel.Metadata;
using System.IdentityModel.Tokens;
using easygenerator.DomainModel.Entities;
using Kentor.AuthServices.Configuration;
using Kentor.AuthServices.WebSso;

namespace easygenerator.Web.SAML.ServiceProvider.Mappers
{
    public class IdentityProviderMapper: IIdentityProviderMapper
    {
        public Kentor.AuthServices.IdentityProvider Map(SamlIdentityProvider idP, SPOptions sPOptions)
        {
            var identityProvider = new Kentor.AuthServices.IdentityProvider(new EntityId(idP.EntityId), sPOptions)
            {
                SingleSignOnServiceUrl = new Uri(idP.SingleSignOnServiceUrl),
                Binding = (Saml2BindingType)idP.SingleSignOnServiceBinding,
                AllowUnsolicitedAuthnResponse = idP.AllowUnsolicitedAuthnResponse,
                WantAuthnRequestsSigned = idP.WantAuthnRequestsSigned
            };
            var signInKey = new X509RawDataKeyIdentifierClause(System.Text.Encoding.ASCII.GetBytes(idP.SigningCertificate));
            identityProvider.SigningKeys.AddConfiguredKey(signInKey);

            if (string.IsNullOrWhiteSpace(idP.SingleLogoutServiceUrl)) return identityProvider;

            identityProvider.SingleLogoutServiceUrl = new Uri(idP.SingleLogoutServiceUrl);
            identityProvider.SingleLogoutServiceBinding = (Saml2BindingType)(idP.SingleLogoutServiceBinding ?? (short)Saml2BindingType.HttpRedirect);
            return identityProvider;
        }
    }
}