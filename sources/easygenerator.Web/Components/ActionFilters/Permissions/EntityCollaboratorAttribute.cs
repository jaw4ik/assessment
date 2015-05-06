using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
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

        public EntityCollaboratorAttribute(Type entityType, ITypeMethodInvoker typeMethodInvoker)
            : base(entityType, typeMethodInvoker)
        {

        } 

        protected override bool CheckEntityAccess(Entity entity, User user)
        {
            return (bool)TypeMethodInvoker.CallGenericTypeMethod(EntityType, typeof(IEntityPermissionsChecker<>), "HasCollaboratorPermissions", new object[] { user.Email, entity });
        }
    }
}