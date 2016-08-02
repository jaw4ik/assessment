using System;
using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.OrganizationEvents;
using easygenerator.Infrastructure;
using easygenerator.Web.Domain.DomainOperations;
using Microsoft.Ajax.Utilities;

namespace easygenerator.Web.Domain.DomainEvents.Handlers
{
    public class OrganizationSettingsApplicationHandler :
        IDomainEventHandler<OrganizationInviteAcceptedEvent>,
        IDomainEventHandler<OrganizationUserAddedEvent>,
        IDomainEventHandler<OrganizationSettingsSubscriptionUpdatedEvent>,
        IDomainEventHandler<OrganizationSettingsResetEvent>,
        IDomainEventHandler<OrganizationUserRemovedEvent>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOrganizationOperations _organizationOperations;

        public OrganizationSettingsApplicationHandler(IOrganizationOperations organizationOperations, IUnitOfWork unitOfWork)
        {
            _organizationOperations = organizationOperations;
            _unitOfWork = unitOfWork;
        }

        public void Handle(OrganizationInviteAcceptedEvent args)
        {
            Handle(args.Organization.Settings, () => _organizationOperations.ApplySettings(args.Organization, args.User));
        }

        public void Handle(OrganizationUserAddedEvent args)
        {
            Handle(args.Organization.Settings, () => _organizationOperations.ApplySettings(args.Organization, args.User));
        }

        public void Handle(OrganizationSettingsSubscriptionUpdatedEvent args)
        {
            Handle(args.Organization.Settings, () => args.Organization.Users.ForEach(user => _organizationOperations.ApplySettings(args.Organization, user)));
        }

        public void Handle(OrganizationUserRemovedEvent args)
        {
            Handle(args.Organization.Settings, () => _organizationOperations.DiscardSettings(args.Organization, args.User));
        }

        public void Handle(OrganizationSettingsResetEvent args)
        {
            Handle(() => args.Organization.Users.ForEach(user => _organizationOperations.DiscardSettings(args.Organization, user)));
        }

        private void Handle(OrganizationSettings settings, Action handler)
        {
            if (settings == null)
                return;

            Handle(handler);
        }

        private void Handle(Action handler)
        {
            handler();
            _unitOfWork.Save();
        }
    }
}