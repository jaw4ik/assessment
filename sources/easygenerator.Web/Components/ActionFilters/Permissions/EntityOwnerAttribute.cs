﻿using easygenerator.DomainModel.Entities;
using System;
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

        public EntityOwnerAttribute(Type entityType, ITypeMethodInvoker typeMethodInvoker)
            : base(entityType, typeMethodInvoker)
        {

        }

        protected override bool CheckEntityAccess(Entity entity, User user)
        {
            return (bool)TypeMethodInvoker.CallGenericTypeMethod(EntityType, typeof(IEntityPermissionsChecker<>), "HasOwnerPermissions", new object[] { user.Email, entity });
        }
    }
}