using System.Web.Mvc;

namespace easygenerator.Web.Configuration
{
    public class FilterConfiguration
    {
        public static void Configure()
        {
            var filters = GlobalFilters.Filters;

            filters.Add(new HandleErrorAttribute());
        }
    }
}