using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Components.Mappers
{
    public abstract class EntityModelMapper<T> : IEntityModelMapper<T>
        where T : Entity
    {
        public abstract dynamic Map(T entity);

        public virtual dynamic Map(T entity, string username)
        {
            return Map(entity);
        }
    }
}