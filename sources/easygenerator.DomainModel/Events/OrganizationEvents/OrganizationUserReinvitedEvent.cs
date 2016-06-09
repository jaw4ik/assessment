using easygenerator.DomainModel.Entities.Organizations;

namespace easygenerator.DomainModel.Events.OrganizationEvents
{
    public class OrganizationUserReinvitedEvent : OrganizationUserEvent
    {
        public OrganizationUserReinvitedEvent(Organization organization, OrganizationUser user)
            : base(organization, user)
        {
        }
    }
}
