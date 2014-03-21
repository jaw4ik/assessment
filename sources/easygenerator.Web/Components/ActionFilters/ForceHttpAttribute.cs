using System;
using System.Net.Http;
using System.Web.Mvc;
using easygenerator.Web.Components.ActionResults;

namespace easygenerator.Web.Components.ActionFilters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = false)]
    public class ForceHttpAttribute : FilterAttribute, IAuthorizationFilter
    {
        public virtual void OnAuthorization(AuthorizationContext filterContext)
        {
            if (filterContext == null)
            {
                throw new ArgumentNullException("filterContext");
            }

            if (!filterContext.HttpContext.Request.IsSecureConnection ||
                filterContext.ActionDescriptor.ControllerDescriptor.GetCustomAttributes(typeof(RequireHttpsAttribute), true).Length > 0 ||
                filterContext.ActionDescriptor.GetCustomAttributes(typeof(RequireHttpsAttribute), true).Length > 0 ||
                filterContext.ActionDescriptor.ControllerDescriptor.GetCustomAttributes(typeof(CustomRequireHttpsAttribute), true).Length > 0 ||
                filterContext.ActionDescriptor.GetCustomAttributes(typeof(CustomRequireHttpsAttribute), true).Length > 0)
            {
                return;
            }

            HandleHttpsRequest(filterContext);
        }

        protected virtual void HandleHttpsRequest(AuthorizationContext filterContext)
        {
            filterContext.Result = new ForbiddenResult("","HTTPS protocol is forbidden. Please, use HTTP instead.");
        }
    }
}