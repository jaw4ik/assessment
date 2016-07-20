using easygenerator.DomainModel.Entities;
using Kentor.AuthServices.Configuration;

namespace easygenerator.Web.SAML.ServiceProvider.Mappers
{
    public interface IIdentityProviderMapper
    {
        Kentor.AuthServices.IdentityProvider Map(SamlIdentityProvider idP, SPOptions sPOptions);
    }
}