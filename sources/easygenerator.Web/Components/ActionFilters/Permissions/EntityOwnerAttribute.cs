using easygenerator.DomainModel.Entities;
using System;

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
            return entity.CreatedBy == user.Email;
        }
    }
}