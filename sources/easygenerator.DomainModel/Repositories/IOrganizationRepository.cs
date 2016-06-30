using easygenerator.DomainModel.Entities.Organizations;
using System.Collections.Generic;

namespace easygenerator.DomainModel.Repositories
{
    public interface IOrganizationRepository : IRepository<Organization>
    {
        ICollection<Organization> GetAcceptedOrganizations(string email);
        ICollection<Organization> GetAllOrganizations(string email);
    }
}
