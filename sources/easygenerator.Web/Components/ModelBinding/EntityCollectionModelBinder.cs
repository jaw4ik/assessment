using System;
using System.Collections.ObjectModel;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.Web.Components.ModelBinding
{
    public interface IEntityCollectionModelBinder<T> : IModelBinder { }

    public class EntityCollectionModelBinder<T> : IEntityCollectionModelBinder<T> where T : Entity
    {
        private readonly IQuerableRepository<T> _repository;

        public EntityCollectionModelBinder()
        {
            _repository = DependencyResolver.Current.GetService<IQuerableRepository<T>>();
        }

        public object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            var result = new Collection<T>();

            var enumerator = 0;
            var id = bindingContext.ValueProvider.GetValue(bindingContext.ModelName + "[" + enumerator + "]");

            for (; id != null; enumerator++, id = bindingContext.ValueProvider.GetValue(bindingContext.ModelName + "[" + enumerator + "]"))
            {
                Guid entityId;
                if (!Guid.TryParse(id.AttemptedValue, out entityId))
                {
                    continue;
                }

                var entity = _repository.Get(entityId);
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