using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.DataAccess.Repositories
{
    public class SamlServiceProviderRepository : Repository<SamlServiceProvider>, ISamlServiceProviderRepository
    {
        public SamlServiceProviderRepository(IDataContext dataContext)
            : base(dataContext)
        {
        }

        public SamlServiceProvider GetByAssertionConsumerService(string url)
        {
            return _dataContext.GetSet<SamlServiceProvider>().FirstOrDefault(sp => sp.AssertionConsumerServiceUrl == url);
        }
    }
}
