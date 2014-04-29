﻿using System.Web.Http;
using easygenerator.PublicationServer.Constraints;

namespace easygenerator.PublicationServer.Configuration
{
    public static class RouteConfiguration
    {
        public static void ConfigurePublicationApi(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(name: "PublishApi",
               routeTemplate: "api/publish",
               defaults: new { controller = "Publish", action = "PublishCourse" }
           );

            config.Routes.MapHttpRoute(
              name: "Maintenance",
              routeTemplate: "{courseId}/{*pathInfo}",
              defaults: new { controller = "SystemPages", action = "PublishIsInProgress" },
              constraints: new { courseId = config.DependencyResolver.GetService(typeof(MaintenanceRouteConstraint)) }
          );
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
