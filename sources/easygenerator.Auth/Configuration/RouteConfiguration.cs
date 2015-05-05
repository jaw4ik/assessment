using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace easygenerator.Auth.Configuration
{
    public static class RouteConfiguration
    {
        public static void Configure()
        {
            var routes = RouteTable.Routes;
            routes.MapRoute(
                "Auth",
                "auth/{action}",
                new { controller = "Auth", action = "Token", id = "" }
                new[] { "easygenerator.Auth.Controllers" }
            );
        }
    }
}