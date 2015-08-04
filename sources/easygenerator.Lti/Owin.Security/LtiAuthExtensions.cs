using System;
using System.Web;
using System.Web.SessionState;
using Microsoft.Owin.Extensions;
using Owin;

namespace easygenerator.Lti.Owin.Security
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

            return app.Use(typeof(LtiAuthMiddleware), app, options);
        }
    }
}
