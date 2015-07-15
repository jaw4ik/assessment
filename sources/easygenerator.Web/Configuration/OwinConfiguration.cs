﻿using easygenerator.Auth.Configuration;
using easygenerator.Lti.Owin.Security;
using Microsoft.Owin;
using Owin;
using System.Web.Mvc;

[assembly: OwinStartup(typeof(easygenerator.Web.Configuration.OwinConfiguration))]

namespace easygenerator.Web.Configuration
{
    public class OwinConfiguration
    {
        public void Configuration(IAppBuilder app)
        {
            AuthorizationConfiguration.Configure(app);
            app.MapSignalR();

            var ltiAuthProvider = DependencyResolver.Current.GetService<LtiAuthProvider>();
            app.UseLtiAuthentication(new LtiAuthOptions { Provider = ltiAuthProvider, SignInAsAuthenticationType = "ApplicationCookie" });
        }
    }
}
