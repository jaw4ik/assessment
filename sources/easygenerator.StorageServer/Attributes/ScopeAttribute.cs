using System;
using System.Linq;
using System.Security.Claims;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace easygenerator.StorageServer.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = false)]
    public class ScopeAttribute : AuthorizeAttribute
    {
        private static string _scopeClaimType = "scope";
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
            var scopeClaimType = _scopeClaimType;
            var grantedScopes = ClaimsPrincipal.Current.FindAll(scopeClaimType).SelectMany(c => c.Value.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries)).ToList();
            return _scopes.Any(grantedScopes.Contains);
        }
    }
}
