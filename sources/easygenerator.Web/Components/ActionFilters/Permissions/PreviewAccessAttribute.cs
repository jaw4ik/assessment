using System.Configuration;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities;
using System;

namespace easygenerator.Web.Components.ActionFilters.Permissions
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
    public class PreviewAccessAttribute : EntityCollaboratorAttribute
    {
        private string _allowedUsers { get; set; }

        public PreviewAccessAttribute()
            : base(typeof(Course))
        {
            _allowedUsers = ConfigurationManager.AppSettings["preview.allowedUsers"] ?? string.Empty;
        }

        protected override bool CheckEntityAccess(Entity entity, User user)
        {
            return _allowedUsers.Contains(user.Email) || base.CheckEntityAccess(entity, user);
        }

        protected override void Reject(AuthorizationContext authorizationContext)
        {
            authorizationContext.Result = new HttpNotFoundResult();
        }
    }
}