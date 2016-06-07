using System.Web;
using Kentor.AuthServices.Configuration;
using Kentor.AuthServices.HttpModule;
using Kentor.AuthServices.WebSso;

namespace easygenerator.Web.SAML.ServiceProvider.Providers
{
    public class CommandRunner: ICommandRunner
    {
        public CommandResult Run(ICommand command, HttpRequestBase httpRequest, IOptions options)
        {
            var httpRequestData = httpRequest.ToHttpRequestData();
            return command.Run(httpRequestData, options);
        }
    }
}