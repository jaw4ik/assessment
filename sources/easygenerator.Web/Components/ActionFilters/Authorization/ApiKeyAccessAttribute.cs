using easygenerator.Web.Components.ActionResults;
using System;
using System.Web.Mvc;

namespace easygenerator.Web.Components.ActionFilters.Authorization
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false, Inherited = true)]
    public class ApiKeyAccessAttribute : FilterAttribute, IAuthorizationFilter
    {
        private readonly string _key;
        public ApiKeyAccessAttribute(string key)
        {
            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentNullException(nameof(key));
            }
            _key = key;
        }

        public void OnAuthorization(AuthorizationContext authorizationContext)
        {
            if (authorizationContext == null)
            {
                throw new ArgumentNullException(nameof(authorizationContext));
            }

            if (authorizationContext.Result != null)
            {
                return;
            }

            var httpContext = authorizationContext.HttpContext;
            if (httpContext?.Request?.Headers == null)
            {
                throw new InvalidOperationException();
            }
            var apiKey = httpContext.Request.Headers["X-Api-Key"];
            if (apiKey != _key)
            {
                authorizationContext.Result = new HttpStatusCodeWithMessageResult(403);
            }
        }
    }
}