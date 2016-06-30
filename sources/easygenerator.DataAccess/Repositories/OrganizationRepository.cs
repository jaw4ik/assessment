using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.DomainModel.Repositories;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace easygenerator.DataAccess.Repositories
{
    public class OrganizationRepository : Repository<Organization>, IOrganizationRepository
    {
        public OrganizationRepository(IDataContext dataContext) : base(dataContext)
        {
        }

        public ICollection<Organization> GetAcceptedOrganizations(string email)
        {
            return _dataContext.GetSet<Organization>().Where(organization => organization.UserCollection.Any(user => user.Email == email && user.Status == OrganizationUserStatus.Accepted))
                .AsNoTracking().ToList();
        }

        public ICollection<Organization> GetAllOrganizations(string email)
        {
            return _dataContext.GetSet<Organization>().Where(organization => organization.UserCollection.Any(user => user.Email == email)).AsNoTracking().ToList();
        }
    }
}
