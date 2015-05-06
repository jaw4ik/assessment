using System.Configuration;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities;
using System;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.Components.ActionFilters.Permissions
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
    public class PreviewAccessAttribute : EntityCollaboratorAttribute
    {
        public ConfigurationReader ConfigurationReader { get; set; }

        public PreviewAccessAttribute()
            : base(typeof (Course))
        {}

        public PreviewAccessAttribute(ConfigurationReader configurationReader, ITypeMethodInvoker typeMethodInvoker)
            : base(typeof(Course), typeMethodInvoker)
        {
            ConfigurationReader = configurationReader;
        }

        protected override bool CheckEntityAccess(Entity entity, User user)
        {
            return ConfigurationReader.PreviewAllowedUsers.Contains(user.Email) || base.CheckEntityAccess(entity, user);
        }

        protected override void Reject(AuthorizationContext authorizationContext)
        {
            authorizationContext.Result = new HttpNotFoundResult();
        }
    }
}