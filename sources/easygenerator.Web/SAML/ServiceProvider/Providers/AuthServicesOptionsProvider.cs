using Kentor.AuthServices.Configuration;

namespace easygenerator.Web.SAML.ServiceProvider.Providers
{
    public class AuthServicesOptionsProvider: IAuthServicesOptionsProvider
    {
        public AuthServicesOptionsProvider()
        {
            Options = Kentor.AuthServices.Configuration.Options.FromConfiguration;
        }

        public IOptions Options { get; }
    }
}