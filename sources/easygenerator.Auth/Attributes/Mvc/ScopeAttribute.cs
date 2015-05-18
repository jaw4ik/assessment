using System;
using System.Linq;
using System.Security.Claims;
using System.Web;
using System.Web.Mvc;
using easygenerator.Auth.Providers;

namespace easygenerator.Auth.Attributes.Mvc
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

        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            if (base.AuthorizeCore(httpContext))
            {
                var scopeClaimType = AuthorizationConfigurationProvider.ScopeClaimType;
                var grantedScopes = ClaimsPrincipal.Current.FindAll(scopeClaimType).SelectMany(c => c.Value.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries)).ToList();

                return _scopes.Any(grantedScopes.Contains);
            }
            return false;
        }
    }
}
