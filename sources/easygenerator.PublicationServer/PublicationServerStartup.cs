using easygenerator.PublicationServer.Configuration;
using Owin;
using System.Web.Http;

namespace easygenerator.PublicationServer
{
    public class PublicationServerStartup
    {
        public void Configuration(IAppBuilder appBuilder)
        {
            #region [ Api and system pages configuration ]

            var config = new HttpConfiguration();

            ContainerConfiguration.ConfigurePublicationApiContainer(config);
            RouteConfiguration.ConfigurePublicationApi(config);
            GlobalFiltersConfiguration.Configure(config);

            appBuilder.UseWebApi(config);

            #endregion

            #region [ Files server configuration ]

            StaticFilesConfiguration.Configure(config, appBuilder);

            #endregion

            #region [ Wildcard page not found configuration ]

            var pageNotFoundConfig = new HttpConfiguration();
            ContainerConfiguration.ConfigurePageNotFoundContainer(pageNotFoundConfig);
            RouteConfiguration.ConfigurePageNotFoundRoute(pageNotFoundConfig);

            appBuilder.UseWebApi(pageNotFoundConfig);

            #endregion
        }
    }
}
