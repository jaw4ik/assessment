using System;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Components.ModelBinding
{
    public class LearningPathEntityCollectionModelBinderProvider : IModelBinderProvider
    {
        public IModelBinder GetBinder(Type modelType)
        {
            if (!modelType.IsGenericType || !typeof(ILearningPathEntity).IsAssignableFrom(modelType.GetGenericArguments()[0]))
                return null;

            var modelBinderType = typeof (ILearningPathEntityCollectionModelBinder);
            return (IModelBinder)DependencyResolver.Current.GetService(modelBinderType);
        }
    }
}