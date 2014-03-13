using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.WebPages;
using easygenerator.Web.Components.ActionResults;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.Components.ActionFilters.Authorization
{
    [AttributeUsage(AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
    public class WooCommerceTokenAuthorizeAttribute : FilterAttribute, IAuthorizationFilter
    {
        private ConfigurationReader ConfigurationReader
        {
            get { return DependencyResolver.Current.GetService<ConfigurationReader>(); }
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
            if (key == null || ConfigurationReader.WooCommerceConfiguration.ApiKey.Trim() != key.Trim())
            {
                authorizationContext.Result = new HttpStatusCodeResult(HttpStatusCode.Forbidden, "Key is not correct");
            }

        }
    }
}