using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.Infrastructure.DomainModel.Mappings;
using System.Collections.Generic;

namespace easygenerator.DomainModel.Repositories
{
    public interface IOrganizationUserRepository : IRepository<OrganizationUser>
    {
        OrganizationInvite GetCollaborationInvite(OrganizationUser user);
        IEnumerable<OrganizationInvite> GetOrganizationInvites(string email);
    }
}
