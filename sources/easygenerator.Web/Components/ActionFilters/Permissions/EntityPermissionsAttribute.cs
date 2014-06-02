using System;
using easygenerator.DomainModel.Entities;
using easygenerator.Web.Permissions;

namespace easygenerator.Web.Components.ActionFilters.Permissions
{
    public class EntityPermissionsAttribute : EntityAccessAttribute
    {
        public EntityPermissionsAttribute(Type entityType)
            : base(entityType)
        {

        }

        protected override bool CheckEntityAccess(Entity entity, User user)
        {
            return (bool)CallGenericTypeMethod(typeof(IEntityPermissionsChecker<>), "HasPermissions", new object[] { user.Email, entity });
        }
    }
}