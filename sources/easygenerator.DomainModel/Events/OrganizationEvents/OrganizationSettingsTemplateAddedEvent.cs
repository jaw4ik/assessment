using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.DomainModel.Events.OrganizationEvents
{
    public class OrganizationSettingsTemplateAddedEvent : OrganizationEvent
    {
        public Template Template { get; private set; }

        public OrganizationSettingsTemplateAddedEvent(Organization organization, Template template)
            : base(organization)
        {
            ThrowIfTemplateIsInvalid(template);

            Template = template;
        }

        private void ThrowIfTemplateIsInvalid(Template template)
        {
            ArgumentValidation.ThrowIfNull(template, nameof(template));
        }
    }
}
