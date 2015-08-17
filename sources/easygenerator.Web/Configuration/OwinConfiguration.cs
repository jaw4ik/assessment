﻿using easygenerator.Auth.Configuration;
using easygenerator.Auth.Lti;
using easygenerator.Web.Components.Configuration;
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
            var configuration = DependencyResolver.Current.GetService<ConfigurationReader>();

            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);

            app.UseLtiAuthentication(new LtiAuthOptions
            {
                Provider = ltiAuthProvider, 
                AuthPath = configuration.LtiAuthPath, 
                SignInAsAuthenticationType = "ApplicationCookie"
            });
        }
    }
}
