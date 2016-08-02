using easygenerator.DomainModel.Entities.Organizations;

namespace easygenerator.DomainModel.Events.OrganizationEvents
{
    public class OrganizationSettingsSubscriptionUpdatedEvent : OrganizationEvent
    {
        public OrganizationSettingsSubscriptionUpdatedEvent(Organization organization)
            : base(organization)
        {

        }
    }
}
