using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Organizations;

namespace easygenerator.DomainModel.Events.OrganizationEvents
{
    public class OrganizationTitleUpdatedEvent : OrganizationEvent
    {
        public OrganizationTitleUpdatedEvent(Organization organization) : base(organization)
        {
        }
    }
}
