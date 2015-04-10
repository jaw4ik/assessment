using System;
using System.Web.Mvc;
using easygenerator.Web.Components.ActionResults;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.Components.ActionFilters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true)]
    public class CustomRequireHttpsAttribute : FilterAttribute, IAuthorizationFilter
    {
        public ConfigurationReader ConfigurationReader { get; set; }

        public CustomRequireHttpsAttribute() { }

        public CustomRequireHttpsAttribute(ConfigurationReader configurationReader)
        {
            ConfigurationReader = configurationReader;
        }

        public virtual void OnAuthorization(AuthorizationContext filterContext)
        {
            if (filterContext == null)
            {
                throw new ArgumentNullException("filterContext");
            }

            if (!ConfigurationReader.ExternalApi.RequiresHttps)
            {
                return;
            }

            if (!filterContext.HttpContext.Request.IsSecureConnection)
            {
                HandleNonHttpsRequest(filterContext);
            }
        }

        protected virtual void HandleNonHttpsRequest(AuthorizationContext filterContext)
        {
            filterContext.Result = new SslRequiredResult();
        }
    }
}