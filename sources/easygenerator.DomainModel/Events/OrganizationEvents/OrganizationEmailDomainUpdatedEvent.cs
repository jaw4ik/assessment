using easygenerator.DomainModel.Entities.Organizations;

namespace easygenerator.DomainModel.Events.OrganizationEvents
{
    public class OrganizationEmailDomainUpdatedEvent : OrganizationEvent
    {
        public OrganizationEmailDomainUpdatedEvent(Organization organization)
            : base(organization)
        {

        }
    }
}
