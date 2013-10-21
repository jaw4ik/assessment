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

            #region Errors

            routes.MapRoute(
                name: "ErrorNotFound",
                url: "notfound",
                defaults: new { controller = "Error", action = "NotFound" }
            );

            #endregion

            #region Objectives

            routes.MapRoute(
                name: "CreateObjective",
                url: "api/objective/create",
                defaults: new { controller = "Objective", action = "Create" }
            );

            routes.MapRoute(
                name: "UpdateObjective",
                url: "api/objective/update",
                defaults: new { controller = "Objective", action = "Update" }
            );

            routes.MapRoute(
                name: "DeleteObjective",
                url: "api/objective/delete",
                defaults: new { controller = "Objective", action = "Delete" }
            );

            routes.MapRoute(
                name: "GetObjectives",
                url: "api/objectives",
                defaults: new { controller = "Objective", action = "GetCollection" }
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
                name: "UpdateAnswerText",
                url: "api/answer/updateText",
                defaults: new { controller = "Answer", action = "UpdateText" }
            );

            routes.MapRoute(
                name: "UpdateAnswerCorrectness",
                url: "api/answer/updateCorrectness",
                defaults: new { controller = "Answer", action = "UpdateCorrectness" }
            );

            routes.MapRoute(
                name: "GetAnswers",
                url: "api/answers",
                defaults: new { controller = "Answer", action = "GetCollection" }
            );

            #endregion

            #region Learning objects

            routes.MapRoute(
                name: "CreateLearningObject",
                url: "api/learningObject/create",
                defaults: new { controller = "LearningObject", action = "Create" }
            );

            routes.MapRoute(
                name: "DeleteLearningObject",
                url: "api/learningObject/delete",
                defaults: new { controller = "LearningObject", action = "Delete" }
            );

            routes.MapRoute(
                name: "UpdateLearningObjectText",
                url: "api/learningObject/updateText",
                defaults: new { controller = "LearningObject", action = "UpdateText" }
            );

            routes.MapRoute(
                name: "GetLearningObjects",
                url: "api/learningObjects",
                defaults: new { controller = "LearningObject", action = "GetCollection" }
            );

            #endregion

            #region Experiences

            routes.MapRoute(
                name: "GetExperiences",
                url: "api/experiences",
                defaults: new { controller = "Experience", action = "GetCollection" }
            );

            routes.MapRoute(
                name: "CreateExperience",
                url: "api/experience/create",
                defaults: new { controller = "Experience", action = "Create" }
            );

            routes.MapRoute(
                name: "DeleteExperience",
                url: "api/experience/delete",
                defaults: new { controller = "Experience", action = "Delete" }
            );

            routes.MapRoute(
                name: "UpdateExperienceTitle",
                url: "api/experience/updateTitle",
                defaults: new { controller = "Experience", action = "UpdateTitle" }
            );

            routes.MapRoute(
                name: "UpdateExperienceTemplate",
                url: "api/experience/updateTemplate",
                defaults: new { controller = "Experience", action = "UpdateTemplate" }
            );

            routes.MapRoute(
                name: "ExperienceRelateObjectives",
                url: "api/experience/relateObjectives",
                defaults: new { controller = "Experience", action = "RelateObjectives" }
            );

            routes.MapRoute(
                name: "ExperienceUnrelateObjectives",
                url: "api/experience/unrelateObjectives",
                defaults: new { controller = "Experience", action = "UnrelateObjectives" }
            );

            routes.MapRoute(
                name: "BuildExperience",
                url: "experience/build",
                defaults: new { controller = "Experience", action = "Build" }
            );

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
                name: "IsTryMode",
                url: "api/user/istrymode",
                defaults: new { controller = "User", action = "IsTryMode" }
            );

            routes.MapRoute(
               name: "GetCurrentUserEmail",
               url: "api/user",
               defaults: new { controller = "User", action = "GetCurrentUserEmail" }
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
                name: "TryWithoutSignup",
                url: "try",
                defaults: new { controller = "Account", action = "TryWithoutSignup" });

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

            #region FileStorage

            routes.MapRoute(
                name: "Upload",
                url: "api/filestorage/upload",
                defaults: new { controller = "FileStorage", action = "Upload" }
            );

            routes.MapRoute(
                name: "GetFile",
                url: "filestorage/{fileId}",
                defaults: new { controller = "FileStorage", action = "Get", fileId = "", }
            );

            #endregion

            #region Help hints

            routes.MapRoute(
                name: "HideHelpHint",
                url: "api/helpHint/hide",
                defaults: new { controller = "HelpHint", action = "HideHint" }
            );

            routes.MapRoute(
                name: "ShowHelpHint",
                url: "api/helpHint/show",
                defaults: new { controller = "HelpHint", action = "ShowHint" }
            );

            routes.MapRoute(
                name: "GetHelpHints",
                url: "api/helpHints",
                defaults: new { controller = "HelpHint", action = "GetCollection" }
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