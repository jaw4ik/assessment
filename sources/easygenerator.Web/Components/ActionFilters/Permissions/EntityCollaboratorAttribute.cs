using easygenerator.DomainModel.Entities;
using easygenerator.Web.Security.PermissionsCheckers;
using System;

namespace easygenerator.Web.Components.ActionFilters.Permissions
{
    [AttributeUsage(AttributeTargets.Method, AllowMultiple = true)]
    public class EntityCollaboratorAttribute : EntityAccessAttribute
    {
        public EntityCollaboratorAttribute(Type entityType)
            : base(entityType)
        {

        }

        protected override bool CheckEntityAccess(Entity entity, User user)
        {
            return (bool)CallGenericTypeMethod(typeof(IEntityPermissionsChecker<>), "HasCollaboratorPermissions", new object[] { user.Email, entity });
        }
    }
}