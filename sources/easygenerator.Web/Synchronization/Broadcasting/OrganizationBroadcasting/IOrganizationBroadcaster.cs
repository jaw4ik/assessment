using easygenerator.DomainModel.Entities.Organizations;

namespace easygenerator.Web.Synchronization.Broadcasting.OrganizationBroadcasting
{
    public interface IOrganizationBroadcaster : IBroadcaster
    {
        dynamic OrganizationAdmins(Organization organization);
        dynamic OrganizationAdminsExcept(Organization organization, params string[] excludeUsers);
        dynamic InvitedUsers(Organization organization);
        dynamic OtherMembers(Organization organization);
    }
}