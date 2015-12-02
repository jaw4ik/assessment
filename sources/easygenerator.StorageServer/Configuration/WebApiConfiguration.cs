using System.Configuration;
using System.Net.Http.Headers;
using System.Web.Http;
using System.Web.Http.Cors;

namespace easygenerator.StorageServer
{
    public static class WebApiConfiguration
    {
        public static void Register(HttpConfiguration config)
        {
         // Web API configuration and services
            var corsOrigins = ConfigurationManager.AppSettings["CorsOrigins"] ?? "*";
            var cors = new EnableCorsAttribute(corsOrigins, "*", "POST, GET, OPTIONS, DELETE, PUT, HEAD"); // origins, headers, methods
            config.EnableCors(cors);

            // Web API routes
            config.Routes.IgnoreRoute("ElmahHandler", "elmah.axd/{*path}");
            
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
               name: "Video",
               routeTemplate: "video/{id}",
               defaults: new { controller = "Root", action = "Video", id = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
               name: "Root",
               routeTemplate: "{action}/{id}",
               defaults: new { controller = "Root", action = "Index", id = RouteParameter.Optional }
            );


            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));
        }
    }
}
