using System.Configuration;

namespace easygenerator.Web.Components.ActionFilters.Authorization
{
    public class WebApiKeyAccessAttribute : ApiKeyAccessAttribute
    {
        public WebApiKeyAccessAttribute(string appSettingsKey) : base(
            (ConfigurationManager.AppSettings[appSettingsKey] ?? string.Empty))
        {

        }
    }
}