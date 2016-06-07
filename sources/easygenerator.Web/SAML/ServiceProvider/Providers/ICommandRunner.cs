using System.Web;
using Kentor.AuthServices.Configuration;
using Kentor.AuthServices.WebSso;

namespace easygenerator.Web.SAML.ServiceProvider.Providers
{
    public interface ICommandRunner
    {
        CommandResult Run(ICommand command, HttpRequestBase httpRequest, IOptions options);
    }
}