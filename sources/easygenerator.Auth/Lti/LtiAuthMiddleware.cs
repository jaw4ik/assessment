using LtiLibrary.Owin.Security.Lti;
using Microsoft.Owin;
using Microsoft.Owin.Security.Infrastructure;
using Owin;

namespace easygenerator.Auth.Lti
{
    public class LtiAuthMiddleware : LtiAuthenticationMiddleware
    {
        public LtiAuthMiddleware(OwinMiddleware next, IAppBuilder app, LtiAuthOptions options)
            : base(next, app, options)
        {
        }

        protected override AuthenticationHandler<LtiAuthenticationOptions> CreateHandler()
        {
            return new LtiAuthHandler();
        }
    }
}
