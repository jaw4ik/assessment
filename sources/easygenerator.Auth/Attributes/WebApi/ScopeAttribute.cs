using System;
using System.Linq;
using System.Security.Claims;
using System.Web.Http;
using System.Web.Http.Controllers;
using easygenerator.Auth.Providers;

namespace easygenerator.Auth.Attributes.WebApi
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = false)]
    public class ScopeAttribute : AuthorizeAttribute
    {
        string[] _scopes;

        public ScopeAttribute(params string[] scopes)
        {
            if (scopes == null)
            {
                throw new ArgumentNullException("scopes");
            }

            _scopes = scopes;
        }

        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            var scopeClaimType = AuthorizationConfigurationProvider.ScopeClaimType;
            var grantedScopes = ClaimsPrincipal.Current.FindAll(scopeClaimType).SelectMany(c => c.Value.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries)).ToList();
            return _scopes.All(grantedScopes.Contains);
        }
    }
}
