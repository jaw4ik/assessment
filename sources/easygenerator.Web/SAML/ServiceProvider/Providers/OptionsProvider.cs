using System;
using System.IdentityModel.Metadata;
using System.Web;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.SAML.ServiceProvider.Mappers;
using Kentor.AuthServices.Configuration;
using Microsoft.Ajax.Utilities;

namespace easygenerator.Web.SAML.ServiceProvider.Providers
{
    public class OptionsProvider : IOptionsProvider
    {
        public OptionsProvider(ISamlIdentityProviderRepository samlIdentityProviderRepository, IIdentityProviderMapper identityProviderMapper)
        {
            Options = Kentor.AuthServices.Configuration.Options.FromConfiguration;

            var serviceProviderUrl = HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Authority);
            var entityId = serviceProviderUrl + Options.SPOptions.ModulePath;

            Options.SPOptions.EntityId = new EntityId(entityId);
            Options.SPOptions.ReturnUrl = new Uri(serviceProviderUrl);

            var idPs = samlIdentityProviderRepository.GetCollection();
            idPs.ForEach(idP => Options.IdentityProviders.Add(identityProviderMapper.Map(idP, Options.SPOptions)));
        }
        
        public IOptions Options { get; set; }
    }
}