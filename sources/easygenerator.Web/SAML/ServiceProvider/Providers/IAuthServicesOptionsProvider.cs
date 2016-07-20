using Kentor.AuthServices.Configuration;

namespace easygenerator.Web.SAML.ServiceProvider.Providers
{
    public interface IAuthServicesOptionsProvider
    {
        IOptions Options { get; }
    }
}