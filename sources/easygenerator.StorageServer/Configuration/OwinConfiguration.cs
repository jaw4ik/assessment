using System.Web.Http;
using System.Web.Http.ExceptionHandling;
using Autofac.Integration.WebApi;
using Elmah.Contrib.WebApi;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(easygenerator.StorageServer.Configuration.OwinConfiguration))]

namespace easygenerator.StorageServer.Configuration
{
    public class OwinConfiguration
    {
        public void Configuration(IAppBuilder app)
        {
            var config = new HttpConfiguration();

            config.Filters.Add(new ElmahHandleErrorApiAttribute());

            AuthorizationConfiguration.Configure(app);
            WebApiConfiguration.Register(config);
            ContainerConfiguration.Configure(app, config);
        }
    }
}
