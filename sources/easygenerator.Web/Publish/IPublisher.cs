using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Publish
{
    public interface IPublisher
    {
        bool Publish<T>(T entity) where T : IPublishableEntity;
    }
}