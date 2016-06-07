using System.IdentityModel.Metadata;
using System.Web;
using Kentor.AuthServices.Configuration;
using Kentor.AuthServices.WebSso;

namespace easygenerator.Web.SAML.ServiceProvider.Providers
{
    public interface ISignInCommandRunner: ICommandRunner
    {
        CommandResult Run(EntityId idpEntityId, string returnPath, HttpRequestBase httpRequest, IOptions options);
    }
}