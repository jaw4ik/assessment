using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Publish.External
{
    public interface IExternalPublisher
    {
        bool Publish<T>(T entity, Company company, string userEmail) where T : IPublishableEntity;
    }
}
