using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.Infrastructure;

namespace easygenerator.Web.Synchronization.Broadcasting.OrganizationBroadcasting
{
    public class OrganizationBroadcaster : Broadcaster, IOrganizationBroadcaster
    {
        private readonly IOrganizationUserProvider _userProvider;

        public OrganizationBroadcaster(IOrganizationUserProvider userProvider)
        {
            _userProvider = userProvider;
        }

        public dynamic OrganizationAdmins(Organization organization)
        {
            ThrowIfOrganizationNotValid(organization);

            return Users(_userProvider.GetAdmins(organization));
        }

        public dynamic InvitedUsers(Organization organization)
        {
            ThrowIfOrganizationNotValid(organization);

            return Users(_userProvider.GetInvitedUsers(organization));
        }

        public dynamic OtherMembers(Organization organization)
        {
            ThrowIfOrganizationNotValid(organization);

            return UsersExcept(_userProvider.GetMembers(organization), CurrentUsername);
        }

        private void ThrowIfOrganizationNotValid(Organization organization)
        {
            ArgumentValidation.ThrowIfNull(organization, nameof(organization));
        }
    }
}