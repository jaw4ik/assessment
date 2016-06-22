using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Components.Mappers
{
    public interface IEntityMapper
    {
        dynamic Map<T>(T entity) where T : Entity;
        dynamic Map<T>(T entity, string username) where T : Entity;
    }
}
