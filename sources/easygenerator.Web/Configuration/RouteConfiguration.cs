using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.Web.Components.RouteConstraints;

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
                name: "ReviewedCoursePublishIsInProgress",
                url: "review/{courseId}",
                defaults: new { controller = "Maintenance", action = "PublishIsInProgress" },
                constraints: new RouteValueDictionary { { "courseId", DependencyResolver.Current.GetService<PublishIsInProgressConstraint>() } }
             );

            routes.MapRoute(
                name: "ReviewCourse",
                url: "review/{courseId}",
                defaults: new { controller = "Review", action = "ReviewCourse" }
            );

            #endregion

            #region Questions

            routes.MapRoute(
                name: "CreateQuestion",
                url: "api/question/create",
                defaults: new { controller = "Question", action = "Create" }
            );

            routes.MapRoute(
                name: "DeleteQuestion",
                url: "api/question/delete",
                defaults: new { controller = "Question", action = "Delete" }
            );

            routes.MapRoute(
                name: "UpdateQuestionTitle",
                url: "api/question/updateTitle",
                defaults: new { controller = "Question", action = "UpdateTitle" }
            );

            routes.MapRoute(
               name: "UpdateQuestionContent",
               url: "api/question/updateContent",
               defaults: new { controller = "Question", action = "UpdateContent" }
           );


            #endregion

            #region Answers

            routes.MapRoute(
                name: "CreateAnswer",
                url: "api/answer/create",
                defaults: new { controller = "Answer", action = "Create" }
            );

            routes.MapRoute(
                name: "DeleteAnswer",
                url: "api/answer/delete",
                defaults: new { controller = "Answer", action = "Delete" }
            );

            routes.MapRoute(
                name: "UpdateAnswer",
                url: "api/answer/update",
                defaults: new { controller = "Answer", action = "Update" }
            );

            routes.MapRoute(
                name: "GetAnswers",
                url: "api/answers",
                defaults: new { controller = "Answer", action = "GetCollection" }
            );

            #endregion

            #region Learning content

            routes.MapRoute(
                name: "CreateLearningContent",
                url: "api/learningContent/create",
                defaults: new { controller = "LearningContent", action = "Create" }
            );

            routes.MapRoute(
                name: "DeleteLearningContent",
                url: "api/learningContent/delete",
                defaults: new { controller = "LearningContent", action = "Delete" }
            );

            routes.MapRoute(
                name: "UpdateLearningContentText",
                url: "api/learningContent/updateText",
                defaults: new { controller = "LearningContent", action = "UpdateText" }
            );

            routes.MapRoute(
                name: "GetLearningContents",
                url: "api/learningContents",
                defaults: new { controller = "LearningContent", action = "GetCollection" }
            );

            #endregion

            #region Courses

            routes.MapRoute(
                name: "GetCourses",
                url: "api/courses",
                defaults: new { controller = "Course", action = "GetCollection" }
            );

            routes.MapRoute(
                name: "CreateCourse",
                url: "api/course/create",
                defaults: new { controller = "Course", action = "Create" }
            );

            routes.MapRoute(
                name: "DeleteCourse",
                url: "api/course/delete",
                defaults: new { controller = "Course", action = "Delete" }
            );

            routes.MapRoute(
                name: "UpdateCourseTitle",
                url: "api/course/updateTitle",
                defaults: new { controller = "Course", action = "UpdateTitle" }
            );

            routes.MapRoute(
                name: "UpdateCourseTemplate",
                url: "api/course/updateTemplate",
                defaults: new { controller = "Course", action = "UpdateTemplate" }
            );

            routes.MapRoute(
                name: "BuildCourse",
                url: "course/build",
                defaults: new { controller = "Course", action = "Build" }
            );

            routes.MapRoute(
              name: "ScormBuildCourse",
              url: "course/scormbuild",
              defaults: new { controller = "Course", action = "ScormBuild" }
          );

            routes.MapRoute(
                name: "TemplateSettings",
                url: "api/course/{courseId}/template/{templateId}",
                defaults: new { controller = "Course", action = "TemplateSettings" }
            );

            #region Publish routes

            routes.MapRoute(
                "PublishIsInProgress",
                "storage/{courseId}",
                defaults: new { controller = "Maintenance", action = "PublishIsInProgress" },
                constraints: new RouteValueDictionary { { "courseId", DependencyResolver.Current.GetService<PublishIsInProgressConstraint>() } }
                );

            routes.MapRoute(
                "PublishedPackage",
                "storage/{packageId}/{*resourceUrl}",
                defaults: new { controller = "PublishedPackage", action = "GetPublishedResource" }
                );

            #endregion

            #endregion

            #region Templates

            routes.MapRoute(
                name: "GetTemplates",
                url: "api/templates",
                defaults: new { controller = "Template", action = "GetCollection" }
            );

            #endregion

            #region Users

            routes.MapRoute(
                name: "SigninUser",
                url: "api/user/signin",
                defaults: new { controller = "User", action = "Signin" }
            );

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

            routes.MapRoute(
                name: "SignUpFirstStep",
                url: "api/user/signupfirststep",
                defaults: new { controller = "User", action = "SignUpFirstStep" }
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
                name: "SignIn",
                url: "signin",
                defaults: new { controller = "Account", action = "SignIn" });

            routes.MapRoute(
                name: "SignOut",
                url: "signout",
                defaults: new { controller = "Account", action = "SignOut" });

            routes.MapRoute(
                name: "LaunchTryMode",
                url: "launchtry",
                defaults: new { controller = "Account", action = "LaunchTryMode" });

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
                name: "Default",
                url: "",
                defaults: new { controller = "Application", action = "Index" }
            );
        }
    }
}