using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Extensions;
using System;
using System.Web.Mvc;

namespace easygenerator.Web.Components.ModelBinding
{
    public interface ILearningPathEntityModelBinder : IModelBinder { }

    public class LearningPathEntityModelBinder : ILearningPathEntityModelBinder
    {
        private readonly IQuerableRepository<Course> _courseRepository;
        private readonly IQuerableRepository<Document> _documentRepository;

        public LearningPathEntityModelBinder()
        {
            _courseRepository = DependencyResolver.Current.GetService<IQuerableRepository<Course>>();
            _documentRepository = DependencyResolver.Current.GetService<IQuerableRepository<Document>>();
        }

        public object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            var entityId = bindingContext.ValueProvider.GetGuidValue(bindingContext.ModelName + "Id");
            return entityId.HasValue ? _courseRepository.Get(entityId.Value) ?? _documentRepository.Get(entityId.Value) as ILearningPathEntity : null;
        }
    }
}