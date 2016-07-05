using System.Configuration;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.Components.ActionFilters.Authorization
{
    public class CoggnoApiKeyAccessAttribute : ApiKeyAccessAttribute
    {
        public CoggnoApiKeyAccessAttribute(): base(
            (ConfigurationManager.GetSection("coggno") as CoggnoConfigurationSection)?.ApiKey)
        {
            
        }
    }
}