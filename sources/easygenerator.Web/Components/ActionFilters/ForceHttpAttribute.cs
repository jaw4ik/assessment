using easygenerator.Web.Components.ActionResults;
using easygenerator.Web.Extensions;
using System;
using System.Reflection;
using System.Web.Mvc;

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

            if (filterContext.HttpContext.Request.IsSecureConnection && !IsHttpsRequired(filterContext))
            {
                HandleHttpsRequest(filterContext);
            }
        }

        private bool IsHttpsRequired(AuthorizationContext filterContext)
        {
            return HasRequireHttpsAttribute(filterContext.ActionDescriptor) ||
                   HasRequireHttpsAttribute(filterContext.ActionDescriptor.ControllerDescriptor);
        }

        private bool HasRequireHttpsAttribute(ICustomAttributeProvider provider)
        {
            return provider.HasCustomAttribute(typeof(RequireHttpsAttribute)) ||
                   provider.HasCustomAttribute(typeof(CustomRequireHttpsAttribute));
        }

        protected virtual void HandleHttpsRequest(AuthorizationContext filterContext)
        {
            filterContext.Result = new ForbiddenResult("", "HTTPS protocol is forbidden. Please, use HTTP instead.");
        }
    }
}