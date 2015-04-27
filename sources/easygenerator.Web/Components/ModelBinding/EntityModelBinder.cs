using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Extensions;
using System;
using System.Web.Mvc;

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
            Guid? entityId = bindingContext.ValueProvider.GetGuidValue(bindingContext.ModelName + "Id");
            return entityId.HasValue ? _repository.Get(entityId.Value) : null;
        }
    }
}