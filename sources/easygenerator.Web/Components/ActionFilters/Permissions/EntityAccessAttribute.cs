using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Extensions;
using System;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities.Users;

namespace easygenerator.Web.Components.ActionFilters.Permissions
{
    public abstract class EntityAccessAttribute : AccessAttribute
    {
        protected Type EntityType { get; set; }
        public ITypeMethodInvoker TypeMethodInvoker { get; set; }

        protected EntityAccessAttribute(Type entityType)
        {
            if (!entityType.IsSubclassOf(typeof(Entity)))
                throw new ArgumentException("Entity type is not a subclass of Entity", "entityType");

            EntityType = entityType;
            ErrorMessageResourceKey = Errors.DataHasBeenChangedErrorMessageKey;
        }

        protected override bool CheckAccess(AuthorizationContext authorizationContext, User user)
        {
            var entityIdValueKey = EntityType.Name.ToLower() + "Id";
            var entityId = authorizationContext.Controller.ValueProvider.GetGuidValue(entityIdValueKey);
            if (!entityId.HasValue)
            {
                return false;
            }
            
            var entity = GetEntity(entityId.Value);
            return entity == null || CheckEntityAccess(entity, user);
        }

        protected abstract bool CheckEntityAccess(Entity entity, User user);

        private Entity GetEntity(Guid id)
        {
            return (Entity)TypeMethodInvoker.CallGenericTypeMethod(EntityType, typeof(IQuerableRepository<>), "Get", new object[] { id });
        }
    }

}
