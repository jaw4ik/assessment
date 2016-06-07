using System;
using System.IdentityModel.Metadata;
using System.Web;
using Kentor.AuthServices.Configuration;
using Kentor.AuthServices.HttpModule;
using Kentor.AuthServices.WebSso;

namespace easygenerator.Web.SAML.ServiceProvider.Providers
{
    public class SignInCommandRunner: CommandRunner, ISignInCommandRunner
    {
        public CommandResult Run(EntityId idpEntityId, string returnPath, HttpRequestBase httpRequest, IOptions options)
        {
            if (httpRequest == null)
            {
                throw new ArgumentNullException(nameof(httpRequest));
            }
            if (options == null)
            {
                throw new ArgumentNullException(nameof(options));
            }

            var httpRequestData = httpRequest.ToHttpRequestData();
            return SignInCommand.Run(idpEntityId, returnPath, httpRequestData, options, null);
        }
    }
}