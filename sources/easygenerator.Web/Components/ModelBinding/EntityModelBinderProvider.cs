using System;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Components.ModelBinding
{
    public class EntityModelBinderProvider : IModelBinderProvider
    {
        public IModelBinder GetBinder(Type modelType)
        {
            if (!typeof(Entity).IsAssignableFrom(modelType))
                return null;

            Type modelBinderType = typeof(IEntityModelBinder<>).MakeGenericType(modelType);
            return (IModelBinder)DependencyResolver.Current.GetService(modelBinderType);
        }
    }
}