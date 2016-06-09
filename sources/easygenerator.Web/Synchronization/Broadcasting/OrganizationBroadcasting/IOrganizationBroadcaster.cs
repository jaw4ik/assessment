using easygenerator.DomainModel.Entities.Organizations;

namespace easygenerator.Web.Synchronization.Broadcasting.OrganizationBroadcasting
{
    public interface IOrganizationBroadcaster : IBroadcaster
    {
        dynamic OrganizationAdmins(Organization organization);
        dynamic InvitedUsers(Organization organization);
        dynamic OtherMembers(Organization organization);
    }
}