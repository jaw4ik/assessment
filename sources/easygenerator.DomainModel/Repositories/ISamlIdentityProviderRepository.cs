using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Repositories
{
    public interface ISamlIdentityProviderRepository : IRepository<SamlIdentityProvider>
    {
        SamlIdentityProvider GetByEntityId(string entityId);
        SamlIdentityProvider GetByName(string name);
    }
}
