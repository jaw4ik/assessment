using System;
using Owin;

namespace easygenerator.Auth.Lti
{
    public static class LtiAuthExtensions
    {
        public static IAppBuilder UseLtiAuthentication(this IAppBuilder app, LtiAuthOptions options)
        {
            if (app == null)
            {
                throw new ArgumentNullException("app");
            }
            if (options == null)
            {
                throw new ArgumentNullException("options");
            }

            app.Use<LtiExceptionHandler>();
            return app.Use<LtiAuthMiddleware>(app, options);
        }
    }
}
