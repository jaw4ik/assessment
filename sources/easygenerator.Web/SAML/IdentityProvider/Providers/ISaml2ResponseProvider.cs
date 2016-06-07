using easygenerator.Web.SAML.IdentityProvider.Models;
using Kentor.AuthServices.Saml2P;

namespace easygenerator.Web.SAML.IdentityProvider.Providers
{
    public interface ISaml2ResponseProvider
    {
        Saml2Response CreateSaml2Response(AssertionModel assertionModel);
    }
}