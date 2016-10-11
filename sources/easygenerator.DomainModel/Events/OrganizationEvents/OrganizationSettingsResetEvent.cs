using easygenerator.DomainModel.Entities.Organizations;

namespace easygenerator.DomainModel.Events.OrganizationEvents
{
    public class OrganizationSettingsResetEvent : OrganizationEvent
    {
        public OrganizationSettingsResetEvent(Organization organization)
            : base(organization)
        {

        }
    }
}
