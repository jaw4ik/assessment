using easygenerator.DomainModel.Entities.Organizations;
using System.Collections.Generic;

namespace easygenerator.Web.Synchronization.Broadcasting.OrganizationBroadcasting
{
    public interface IOrganizationUserProvider
    {
        IEnumerable<string> GetAdmins(Organization organization);
        IEnumerable<string> GetInvitedUsers(Organization organization);
        IEnumerable<string> GetMembers(Organization organization);
    }

}