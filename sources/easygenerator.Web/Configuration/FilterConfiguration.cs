using System.Web.Mvc;
using easygenerator.Web.Components.ActionFilters;
using HandleErrorAttribute = easygenerator.Web.Components.ActionFilters.HandleErrorAttribute;

namespace easygenerator.Web.Configuration
{
    public class FilterConfiguration
    {
        public static void Configure()
        {
            var filters = GlobalFilters.Filters;

            filters.Add(new HandleErrorAttribute());
            filters.Add(new ApplicationAuthorize());
        }
    }
}