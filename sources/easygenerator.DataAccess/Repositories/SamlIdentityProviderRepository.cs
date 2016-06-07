using System.Data.Entity;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.DataAccess.Repositories
{
    public class SamlIdentityProviderRepository : Repository<SamlIdentityProvider>, ISamlIdentityProviderRepository
    {
        public SamlIdentityProviderRepository(IDataContext dataContext)
            : base(dataContext)
        {
        }

        public SamlIdentityProvider GetByEntityId(string id)
        {
            // first fetch all matched entries, then filter (if filter on DB side comparison will be NOT case sensitive)
            return _dataContext.GetSet<SamlIdentityProvider>().Include(e => e.SamlIdPUserInfoes).Where(idP => idP.EntityId == id).AsEnumerable()
                .FirstOrDefault(idP => idP.EntityId == id);
        }

        public SamlIdentityProvider GetByName(string name)
        {
            return _dataContext.GetSet<SamlIdentityProvider>().Include(e => e.SamlIdPUserInfoes).Where(idP => idP.Name == name).AsEnumerable()
                .FirstOrDefault(idP => idP.Name == name);
        }
    }
}
