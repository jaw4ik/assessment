using easygenerator.PublicationServer.ActionFilters;
using System.Web.Http;
using easygenerator.PublicationServer.Extensions;

namespace easygenerator.PublicationServer.Configuration
{
    public static class GlobalFiltersConfiguration
    {
        public static void Configure(HttpConfiguration config)
        {
            config.Filters.Add(config.DependencyResolver.GetService<GeneralExceptionFilterAttribute>());
        }
    }
}
