﻿using System.Web.Mvc;
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

            #region Objectives

            routes.MapRoute(
                name: "CreateObjective",
                url: "api/objective/create",
                defaults: new { controller = "Objective", action = "Create" }
            );

            routes.MapRoute(
                name: "UpdateObjective",
                url: "api/objective/update",
                defaults: new { controller = "Objective", action = "Update" }
            );

            routes.MapRoute(
                name: "DeleteObjective",
                url: "api/objective/delete",
                defaults: new { controller = "Objective", action = "Delete" }
            );

            routes.MapRoute(
                name: "GetObjectives",
                url: "api/objectives",
                defaults: new { controller = "Objective", action = "GetCollection" }
            );

            #endregion

            #region Questions

            routes.MapRoute(
                name: "CreateQuestion",
                url: "api/question/create",
                defaults: new { controller = "Question", action = "Create" }
            );

            #endregion

            #region Experiences

            routes.MapRoute(
                name: "GetExperiences",
                url: "api/experiences",
                defaults: new { controller = "Experience", action = "GetCollection" }
            );

            routes.MapRoute(
                name: "CreateExperience",
                url: "api/experience/create",
                defaults: new { controller = "Experience", action = "Create" }
            );

            routes.MapRoute(
                name: "DeleteExperience",
                url: "api/experience/delete",
                defaults: new { controller = "Experience", action = "Delete" }
            );

            routes.MapRoute(
                name: "BuildExperience",
                url: "experience/build",
                defaults: new { controller = "Experience", action = "Build" }
            );

            #endregion

            routes.MapRoute(
                name: "Default",
                url: "",
                defaults: new { controller = "Application", action = "Index" }
            );
        }
    }
}