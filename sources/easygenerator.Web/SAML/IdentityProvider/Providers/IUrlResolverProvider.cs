using System;

namespace easygenerator.Web.SAML.IdentityProvider.Providers
{
    public interface IUrlResolverProvider
    {
        Uri RootUrl { get; }
        Uri SsoServiceUrl { get; }
        Uri MetadataUrl { get; }
        Uri LogoutServiceUrl { get; }
    }
}
