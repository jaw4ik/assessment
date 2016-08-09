using easygenerator.DomainModel.Entities.Organizations;

namespace easygenerator.DomainModel.Events.OrganizationEvents
{
    public class OrganizationSettingsSubscriptionResetEvent : OrganizationEvent
    {
        public OrganizationSettingsSubscriptionResetEvent(Organization organization)
            : base(organization)
        {

        }
    }
}
