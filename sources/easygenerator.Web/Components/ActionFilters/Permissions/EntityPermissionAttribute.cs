using easygenerator.DomainModel.Entities;
using easygenerator.Web.Permissions;
using System;

namespace easygenerator.Web.Components.ActionFilters.Permissions
{
    public class EntityPermissionAttribute : EntityAccessAttribute
    {
        public EntityPermissionAttribute(Type entityType)
            : base(entityType)
        {

        }

        protected override bool CheckEntityAccess(Entity entity, User user)
        {
            return (bool)CallGenericTypeMethod(typeof(IEntityPermissionChecker<>), "HasPermissions", new object[] { entity });
        }
    }
}