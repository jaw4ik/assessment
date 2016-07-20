using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Publish.Coggno
{
    public interface ICoggnoPublisher
    {
        bool Publish<T>(T entity, string userFirstName, string userLastName) where T : ICoggnoPublishableEntity;
    }
}