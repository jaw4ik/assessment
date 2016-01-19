using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using System;
using System.Collections.ObjectModel;
using System.Web.Mvc;

namespace easygenerator.Web.Components.ModelBinding
{
    public interface ILearningPathEntityCollectionModelBinder : IModelBinder { }

    public class LearningPathEntityCollectionModelBinder : ILearningPathEntityCollectionModelBinder
    {
        private readonly IQuerableRepository<Course> _courseRepository;
        private readonly IQuerableRepository<Document> _documentRepository;

        public LearningPathEntityCollectionModelBinder()
        {
            _courseRepository = DependencyResolver.Current.GetService<IQuerableRepository<Course>>();
            _documentRepository = DependencyResolver.Current.GetService<IQuerableRepository<Document>>();
        }

        public object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            var result = new Collection<ILearningPathEntity>();

            var enumerator = 0;
            var id = bindingContext.ValueProvider.GetValue(bindingContext.ModelName + "[" + enumerator + "]");

            for (; id != null; enumerator++, id = bindingContext.ValueProvider.GetValue(bindingContext.ModelName + "[" + enumerator + "]"))
            {
                Guid entityId;
                if (!Guid.TryParse(id.AttemptedValue, out entityId))
                {
                    continue;
                }

                var entity = _courseRepository.Get(entityId) ?? _documentRepository.Get(entityId) as ILearningPathEntity;

                if (entity == null)
                {
                    continue;
                }

                result.Add(entity);
            }

            return result;
        }
    }
}