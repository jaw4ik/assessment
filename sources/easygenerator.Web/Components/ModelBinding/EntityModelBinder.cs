using System;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.Web.Components.ModelBinding
{
    public interface IEntityModelBinder<T> : IModelBinder { }

    public class EntityModelBinder<T> : IEntityModelBinder<T> where T : Entity
    {
        private readonly IQuerableRepository<T> _repository;

        public EntityModelBinder()
        {
            _repository = DependencyResolver.Current.GetService<IQuerableRepository<T>>();
        }

        public object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            ValueProviderResult id = bindingContext.ValueProvider.GetValue(bindingContext.ModelName + "Id");

            if (id == null)
                return null;

            Guid entityId;

            if (!Guid.TryParse(id.AttemptedValue, out entityId))
                return null;

            return _repository.Get(entityId);
        }
    }
}