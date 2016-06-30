using easygenerator.DomainModel.Entities.Organizations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.DomainModel.Events.OrganizationEvents
{
    public class OrganizationInviteDeclinedEvent : OrganizationUserEvent
    {
        public OrganizationInviteDeclinedEvent(Organization organization, OrganizationUser user)
            : base(organization, user)
        {
        }
    }
}
