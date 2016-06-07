using Kentor.AuthServices.Metadata;

namespace easygenerator.Web.SAML.IdentityProvider.Providers
{
    public interface IMetadataProvider
    {
        ExtendedEntityDescriptor GetIdpMetadata(bool includeCacheDuration = true);
    }
}