using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Components.Mappers
{
    public interface IEntityMapper<T> where T : Entity
    {
        dynamic Map(T entity);
    }
}
