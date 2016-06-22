using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.Infrastructure.DomainModel.Mappings;
using System.Collections.Generic;

namespace easygenerator.DomainModel.Repositories
{
    public interface IOrganizationUserRepository : IRepository<OrganizationUser>
    {
        OrganizationInvite GetOrganizationInvite(OrganizationUser user);
        IEnumerable<OrganizationInvite> GetOrganizationInvites(string email);
        IEnumerable<string> GetUserOrganizationAdminEmails(string organizationUserEmail);
        IEnumerable<User> GetUserOrganizationAdminUsers(string organizationUserEmail);
        bool HasMultipleOrganizationAdminRelations(string userEmail, string adminEmail);
    }
}
