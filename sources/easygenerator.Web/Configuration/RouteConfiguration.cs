using System.Web.Mvc;
using System.Web.Routing;

namespace easygenerator.Web.Configuration
{
    public static class RouteConfiguration
    {
        public static void Configure()
        {
            var routes = RouteTable.Routes;

            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapMvcAttributeRoutes();

            #region Errors

            routes.MapRoute(
               name: "ServerError",
               url: "servererror",
               defaults: new { controller = "Error", action = "ServerError" }
            );

            routes.MapRoute(
                name: "ErrorNotFound",
                url: "notfound",
                defaults: new { controller = "Error", action = "NotFound" }
            );

            #endregion

            #region Review

            routes.MapRoute(
                name: "ReviewCourse",
                url: "review/{courseId}",
                defaults: new { controller = "Review", action = "ReviewCourse" }
            );

            #endregion

            #region Courses

            routes.MapRoute(
                name: "OldPublishedPackages",
                url: "storage/{courseId}/{*resourceUrl}",
                defaults: new { controller = "RedirectToNewStorage", action = "RedirectToNewUrl" }
                );

            #endregion

            #region Users

            routes.MapRoute(
                name: "SignupUser",
                url: "api/user/signup",
                defaults: new { controller = "User", action = "Signup" }
            );

            routes.MapRoute(
               name: "ForgotPassword",
               url: "api/user/forgotpassword",
               defaults: new { controller = "User", action = "ForgotPassword" }
            );

            routes.MapRoute(
                name: "CheckUserExists",
                url: "api/user/exists",
                defaults: new { controller = "User", action = "Exists" }
            );

            routes.MapRoute(
               name: "GetCurrentUserInfo",
               url: "api/user",
               defaults: new { controller = "User", action = "GetCurrentUserInfo" }
            );

            #endregion

            #region Account

            routes.MapRoute(
                name: "PrivacyPolicy",
                url: "privacypolicy",
                defaults: new { controller = "Account", action = "PrivacyPolicy" });

            routes.MapRoute(
                name: "TermOfUse",
                url: "termsofuse",
                defaults: new { controller = "Account", action = "TermsOfUse" });

            routes.MapRoute(
                name: "SignUp",
                url: "signup",
                defaults: new { controller = "Account", action = "SignUp" });

            routes.MapRoute(
                name: "Register",
                url: "register",
                defaults: new { controller = "Account", action = "Register" });


            routes.MapRoute(
                name: "SignIn",
                url: "signin",
                defaults: new { controller = "Account", action = "SignIn" });

            routes.MapRoute(
                name: "SignOut",
                url: "signout",
                defaults: new { controller = "Account", action = "SignOut" });

            routes.MapRoute(
                name: "SignUpSecondStep",
                url: "signupsecondstep",
                defaults: new { controller = "Account", action = "SignUpSecondStep" });

            routes.MapRoute(
                name: "PasswordRecovery",
                url: "passwordrecovery/{ticketId}",
                defaults: new { controller = "Account", action = "PasswordRecovery" });

            #endregion;

            #region Feedback

            routes.MapRoute(
                name: "FeedbackFromUser",
                url: "api/feedback/sendfeedback",
                defaults: new { controller = "Feedback", action = "SendFeedback" }
            );

            #endregion

            routes.MapRoute(
               name: "SamlSP",
               url: "saml/sp/{action}",
               defaults: new { controller = "ServiceProvider", action= "Index" }
            );

            routes.MapRoute(
               name: "Auth",
               url: "auth/{action}",
               defaults: new { controller = "Auth", action = "Index" }
            );

            routes.MapRoute(
                name: "Default",
                url: "",
                defaults: new { controller = "Application", action = "Index" }
            );
        }
    }
}