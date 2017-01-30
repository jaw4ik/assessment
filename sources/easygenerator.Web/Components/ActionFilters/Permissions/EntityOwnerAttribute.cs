using easygenerator.DomainModel.Entities;
using System;
using easygenerator.DomainModel.Entities.Users;
using easygenerator.Infrastructure;
using easygenerator.Web.Security.PermissionsCheckers;

namespace easygenerator.Web.Components.ActionFilters.Permissions
{
    public class EntityOwnerAttribute : EntityAccessAttribute
    {
        public EntityOwnerAttribute(Type entityType)
            :base(entityType)
        {
            
        }

        protected override bool CheckEntityAccess(Entity entity, User user)
        {
            return (bool)TypeMethodInvoker.CallGenericTypeMethod(EntityType, typeof(IEntityPermissionsChecker<>), "HasOwnerPermissions", new object[] { user.Email, entity });
        }
    }
}