using System;
using System.Configuration;
using System.Web.Mvc;
using easygenerator.Web.Components.ActionResults;

namespace easygenerator.Web.Components.ActionFilters.Authorization
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false, Inherited = true)]
    public class AllowedUsersAttribute : FilterAttribute, IAuthorizationFilter
    {
        private string _allowedUsers { get; set; }

        public AllowedUsersAttribute(string allowedUsersAppSettingsKey)
        {
            _allowedUsers = ConfigurationManager.AppSettings[allowedUsersAppSettingsKey] ?? string.Empty;
        }

        public void OnAuthorization(AuthorizationContext authorizationContext)
        {
            if (authorizationContext == null)
            {
                throw new ArgumentNullException("authorizationContext");
            }

            if (authorizationContext.Result != null)
            {
                return;
            }

            if (authorizationContext.HttpContext == null || authorizationContext.HttpContext.Request == null || authorizationContext.HttpContext.Request.QueryString == null)
            {
                throw new InvalidOperationException();
            }

            if (!_allowedUsers.Contains(authorizationContext.HttpContext.User.Identity.Name))
            {
                authorizationContext.Result = new HttpStatusCodeWithMessageResult(404);
            }
        }
    }
}