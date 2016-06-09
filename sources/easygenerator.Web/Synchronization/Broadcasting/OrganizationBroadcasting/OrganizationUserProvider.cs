using easygenerator.DomainModel.Entities.Organizations;
using System.Collections.Generic;
using System.Linq;

namespace easygenerator.Web.Synchronization.Broadcasting.OrganizationBroadcasting
{
    public class OrganizationUserProvider : IOrganizationUserProvider
    {
        public IEnumerable<string> GetAdmins(Organization organization)
        {
            return organization.Users.Where(u => u.Status == OrganizationUserStatus.Accepted && u.IsAdmin).Select(c => c.Email).ToList();
        }

        public IEnumerable<string> GetInvitedUsers(Organization organization)
        {
            return organization.Users.Where(u => u.Status == OrganizationUserStatus.WaitingForAcceptance).Select(c => c.Email).ToList();
        }

        public IEnumerable<string> GetMembers(Organization organization)
        {
            return organization.Users.Where(u => u.Status == OrganizationUserStatus.Accepted).Select(c => c.Email).ToList();
        }
    }
}