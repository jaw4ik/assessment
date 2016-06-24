using System;
using System.Web;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.SAML.ServiceProvider.Mappers;
using Kentor.AuthServices.Configuration;
using Microsoft.Ajax.Utilities;
using System.IdentityModel.Metadata;

namespace easygenerator.Web.SAML.ServiceProvider.Providers
{
    public class OptionsProvider : IOptionsProvider
    {
        public OptionsProvider(ISamlIdentityProviderRepository samlIdentityProviderRepository, IIdentityProviderMapper identityProviderMapper)
        {
            Options = Kentor.AuthServices.Configuration.Options.FromConfiguration;

            var returnUrl = HttpContext.Current.Request.Url.Host == "localhost" ?
                HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Authority) :
                $"https://{HttpContext.Current.Request.Url.Host}";
            var entityId = $"{returnUrl}{ Options.SPOptions.ModulePath}";
            Options.SPOptions.ReturnUrl = new Uri(returnUrl);
            Options.SPOptions.EntityId = new EntityId(entityId);

            var idPs = samlIdentityProviderRepository.GetCollection();
            idPs.ForEach(idP => Options.IdentityProviders.Add(identityProviderMapper.Map(idP, Options.SPOptions)));
        }
        
        public IOptions Options { get; set; }
    }
}