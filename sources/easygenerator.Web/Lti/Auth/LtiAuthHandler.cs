using System;
using LtiLibrary.Owin.Security.Lti;
using System.Threading.Tasks;

namespace easygenerator.Web.Lti.Auth
{
    public class LtiAuthHandler : LtiAuthenticationHandler
    {
        public override async Task<bool> InvokeAsync()
        {
            var authOptions = (LtiAuthOptions)Options;
            if (authOptions.AuthPath != null && Context.Request.Path.Value.EndsWith(authOptions.AuthPath))
            {
                return await base.InvokeAsync();
            }
            return false;
        }
    }
}
