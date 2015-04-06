using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Extensions;
using System;
using System.Web.Mvc;

namespace easygenerator.Web.Components.ActionFilters.Permissions
{
    public abstract class EntityAccessAttribute : AccessAttribute
    {
        protected Type EntityType { get; set; }

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
                throw new ArgumentNullException(entityIdValueKey);


            var entity = GetEntity(entityId.Value);
            return entity == null || CheckEntityAccess(entity, user);
        }

        protected abstract bool CheckEntityAccess(Entity entity, User user);

        private Entity GetEntity(Guid id)
        {
            return (Entity)CallGenericTypeMethod(typeof(IQuerableRepository<>), "Get", new object[] { id });
        }

        protected object CallGenericTypeMethod(Type genericType, string methodName, object[] callParams)
        {
            var serviceType = genericType.MakeGenericType(EntityType);
            var service = DependencyResolver.Current.GetService(serviceType);
            var method = serviceType.GetMethod(methodName);
            return method.Invoke(service, callParams);
        }
    }

}
