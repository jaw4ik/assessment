using System;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Components.ModelBinding
{
    public class LearningPathEntityModelBinderProvider : IModelBinderProvider
    {
        public IModelBinder GetBinder(Type modelType)
        {
            if (!typeof(ILearningPathEntity).IsAssignableFrom(modelType))
                return null;

            var modelBinderType = typeof (ILearningPathEntityModelBinder);
            return (IModelBinder)DependencyResolver.Current.GetService(modelBinderType);
        }
    }
}