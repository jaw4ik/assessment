using Kentor.AuthServices.WebSso;

namespace easygenerator.Web.SAML.ServiceProvider.Providers
{
    public interface ICommandProvider
    {
        ICommand GetAcsCommand();
        ICommand GetSignInCommand();
        ICommand GetMetadataCommand();
    }
}