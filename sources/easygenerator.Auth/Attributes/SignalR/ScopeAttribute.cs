using System;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using easygenerator.Auth.Providers;
using AuthorizeAttribute = Microsoft.AspNet.SignalR.AuthorizeAttribute;

namespace easygenerator.Auth.Attributes.SignalR
{
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

        protected override bool UserAuthorized(IPrincipal user)
        {
            if (base.UserAuthorized(user))
            {
                var _scopeClaimType = AuthorizationConfigurationProvider.ScopeClaimType;
                var grantedScopes = ClaimsPrincipal.Current.FindAll(_scopeClaimType).Select(c => c.Value).ToList();

                return _scopes.All(grantedScopes.Contains);
            }
            return false;
        }
    }
}
