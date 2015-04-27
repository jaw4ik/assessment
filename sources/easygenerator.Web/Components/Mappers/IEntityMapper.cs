using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Components.Mappers
{
    public interface IEntityMapper
    {
        dynamic Map<T>(T entity) where T : Entity;
    }
}
