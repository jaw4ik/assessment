using System;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Components.ModelBinding
{
    public class EntityCollectionModelBinderProvider : IModelBinderProvider
    {
        public IModelBinder GetBinder(Type modelType)
        {
            if (!modelType.IsGenericType || !typeof(Entity).IsAssignableFrom(modelType.GetGenericArguments()[0]))
                return null;

            var modelBinderType = typeof(IEntityCollectionModelBinder<>).MakeGenericType(modelType.GetGenericArguments()[0]);
            return (IModelBinder)DependencyResolver.Current.GetService(modelBinderType);
        }
    }
}