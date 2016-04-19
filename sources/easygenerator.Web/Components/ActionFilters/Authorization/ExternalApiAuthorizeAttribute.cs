using easygenerator.Web.Components.ActionResults;
using easygenerator.Web.Components.Configuration;
using System;
using System.Linq;
using System.Web.Mvc;
using easygenerator.Web.Components.Configuration.ApiKeys;

namespace easygenerator.Web.Components.ActionFilters.Authorization
{
    [AttributeUsage(AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
    public class ExternalApiAuthorizeAttribute : FilterAttribute, IAuthorizationFilter
    {
        public string ApiKeyName { get; set; }
        public ConfigurationReader ConfigurationReader { get; set; }

        public ExternalApiAuthorizeAttribute(string apiKeyName)
        {
            ApiKeyName = apiKeyName;
        }

        public ExternalApiAuthorizeAttribute(string apiKeyName, ConfigurationReader configurationReader)
        {
            ApiKeyName = apiKeyName;
            ConfigurationReader = configurationReader;
        }

        public void OnAuthorization(AuthorizationContext authorizationContext)
        {
            if (authorizationContext == null)
            {
                throw new ArgumentNullException("authorizationContext");
            }

            if (authorizationContext.Result != null)
            {
                return;
            }

            if (authorizationContext.HttpContext == null ||
                authorizationContext.HttpContext.Request == null ||
                authorizationContext.HttpContext.Request.QueryString == null)
            {
                throw new InvalidOperationException();
            }

            var key = authorizationContext.HttpContext.Request.QueryString["key"];
            var apiKey = (from ApiKeyElement e in ConfigurationReader.ExternalApi.ApiKeys
                          where e.Name == ApiKeyName
                          select e)
                          .SingleOrDefault();

            if (key == null || apiKey == null || apiKey.Value.Trim() != key.Trim())
            {
                authorizationContext.Result = new ForbiddenResult(message: "Key is not correct");
            }
        }
    }
}