using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.DomainModel.Events.OrganizationEvents
{
    public class OrganizationUserAddedEvent : OrganizationUserEvent
    {
        public OrganizationUserAddedEvent(Organization organization, OrganizationUser user)
            : base(organization, user)
        {
        }
    }
}
