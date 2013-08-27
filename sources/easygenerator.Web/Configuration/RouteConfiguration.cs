using System.Web.Mvc;
using System.Web.Routing;

namespace easygenerator.Web.Configuration
{
    public static class RouteConfiguration
    {
        public static void Configure()
        {
            var routes = RouteTable.Routes;

            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");


            routes.MapRoute(
                name: "ApiObjectives",
                url: "api/data",
                defaults: new { controller = "Application", action = "ApplicationData" }
            );

            //routes.MapRoute(
            //    name: "CreateObjective",
            //    url: "objective/create",
            //    defaults: new { controller = "Objective", action = "Create" }
            //);

            //routes.MapRoute(
            //    name: "ObjectiveDetails",
            //    url: "objective/details",
            //    defaults: new { controller = "Objective", action = "Details" }
            //);

            //routes.MapRoute(
            //    name: "Objectives",
            //    url: "objectives",
            //    defaults: new { controller = "Objective", action = "Index" }
            //);

            routes.MapRoute(
                name: "CreateObjective",
                url: "api/objective/create",
                defaults: new { controller = "Objective", action = "Create" }
            );


            routes.MapRoute(
                name: "BuildExperience",
                url: "experience/build",
                defaults: new { controller = "Experience", action = "Build" }
            );

            routes.MapRoute(
                name: "Default",
                url: "",
                defaults: new { controller = "Application", action = "Index" }
            );
        }
    }
}