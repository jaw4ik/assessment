using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.DomainModel.Events.OrganizationEvents
{
    public abstract class OrganizationUserEvent : OrganizationEvent
    {
        public OrganizationUser User { get; private set; }

        protected OrganizationUserEvent(Organization organization, OrganizationUser user)
            : base(organization)
        {
            ThrowIfUserIsInvalid(user);

            User = user;
        }

        private void ThrowIfUserIsInvalid(OrganizationUser user)
        {
            ArgumentValidation.ThrowIfNull(user, "user");
        }
    }
}
