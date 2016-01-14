using Owin;
using Microsoft.Owin;
using System.Web.Http;

[assembly: OwinStartup(typeof(easygenerator.PdfConverter.Configuration.OwinConfiguration))]

namespace easygenerator.PdfConverter.Configuration
{
    public class OwinConfiguration
    {
        public void Configuration(IAppBuilder app)
        {
            var config = new HttpConfiguration();

            WebApiConfiguration.Register(config);
            app.UseWebApi(config);
        }
    }
}