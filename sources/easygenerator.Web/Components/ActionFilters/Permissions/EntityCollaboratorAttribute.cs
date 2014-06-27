using easygenerator.DomainModel.Entities;
using System;
using easygenerator.Web.Security.PermissionsCheckers;

namespace easygenerator.Web.Components.ActionFilters.Permissions
{
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