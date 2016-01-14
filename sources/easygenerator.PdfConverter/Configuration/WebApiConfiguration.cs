using System.Net.Http.Headers;
using System.Web.Http;

namespace easygenerator.PdfConverter.Configuration
{
    public static class WebApiConfiguration
    {
        public static void Register(HttpConfiguration config)
        {
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "Root",
                routeTemplate: "{action}/{id}",
                defaults: new { controller = "Default", action = "Index", id = RouteParameter.Optional }
            );

            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));
        }
    }
}