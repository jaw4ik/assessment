using System.Web.Http;
using easygenerator.PublicationServer.Extensions;
using easygenerator.PublicationServer.Constraints;

namespace easygenerator.PublicationServer.Configuration
{
    public static class RouteConfiguration
    {
        public static void ConfigurePublicationApi(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
              name: "Maintenance",
              routeTemplate: "{courseId}/{*pathInfo}",
              defaults: new { controller = "SystemPages", action = "PublishIsInProgress" },
              constraints: new { courseId = config.DependencyResolver.GetService<MaintenanceRouteConstraint>() }
            );

            var constraintResolver = new InlineConstraintResolver(config.DependencyResolver);
            constraintResolver.ConstraintMap.Add("searchCrawler", typeof(SearchCrawlerRouteConstraint));

            config.MapHttpAttributeRoutes(constraintResolver);
        }

        public static void ConfigurePageNotFoundRoute(HttpConfiguration config)
        {
            config.Routes.IgnoreRoute("ElmahHandler", "elmah.axd/{*path}");

            config.Routes.MapHttpRoute(
            name: "PageNotFound",
            routeTemplate: "{*path}",
            defaults: new { controller = "SystemPages", action = "PageNotFound" });

        }
    }
}
