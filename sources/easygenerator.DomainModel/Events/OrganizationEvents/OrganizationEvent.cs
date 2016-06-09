using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.DomainModel.Events.OrganizationEvents
{
    public abstract class OrganizationEvent : Event
    {
        public Organization Organization { get; private set; }

        protected OrganizationEvent(Organization organization)
        {
            ThrowIfOrganizationIsInvalid(organization);

            Organization = organization;
        }

        private void ThrowIfOrganizationIsInvalid(Organization organization)
        {
            ArgumentValidation.ThrowIfNull(organization, "organization");
        }
    }
}
