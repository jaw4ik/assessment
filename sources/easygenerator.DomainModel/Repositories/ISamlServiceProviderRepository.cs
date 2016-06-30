using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Repositories
{
    public interface ISamlServiceProviderRepository : IRepository<SamlServiceProvider>
    {
        SamlServiceProvider GetByAssertionConsumerService(string url);
    }
}
