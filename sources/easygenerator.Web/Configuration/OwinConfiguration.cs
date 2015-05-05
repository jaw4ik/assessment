using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(easygenerator.Web.Configuration.OwinConfiguration))]

namespace easygenerator.Web.Configuration
{
    public class OwinConfiguration
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}
