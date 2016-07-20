using Kentor.AuthServices.Configuration;

namespace easygenerator.Web.SAML.ServiceProvider.Providers
{
    public interface IOptionsProvider
    {
        IOptions Options { get; set; }
    }
}