using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.OrganizationEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Domain.DomainOperations;
using Microsoft.Ajax.Utilities;
using System;
using System.Linq;

namespace easygenerator.Web.Domain.DomainEvents.Handlers.Organizaions
{
    public class OrganizationSettingsApplicationHandler :
        IDomainEventHandler<OrganizationInviteAcceptedEvent>,
        IDomainEventHandler<OrganizationUserAddedEvent>,
        IDomainEventHandler<OrganizationSettingsSubscriptionUpdatedEvent>,
        IDomainEventHandler<OrganizationSettingsSubscriptionResetEvent>,
        IDomainEventHandler<OrganizationSettingsTemplateAddedEvent>,
        IDomainEventHandler<OrganizationSettingsResetEvent>,
        IDomainEventHandler<OrganizationUserRemovedEvent>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOrganizationOperations _organizationOperations;
        private readonly IOrganizationUserRepository _organizationUserRepository;

        public OrganizationSettingsApplicationHandler(IOrganizationOperations organizationOperations, IUnitOfWork unitOfWork, IOrganizationUserRepository organizationUserRepository)
        {
            _organizationOperations = organizationOperations;
            _unitOfWork = unitOfWork;
            _organizationUserRepository = organizationUserRepository;
        }

        public void Handle(OrganizationInviteAcceptedEvent args)
        {
            Handle(args.Organization.Settings, () =>
                MainOrganizationOperation(args.User, () =>
                    _organizationOperations.ApplySettings(args.User, args.Organization.Settings)));
        }

        public void Handle(OrganizationUserAddedEvent args)
        {
            Handle(args.Organization.Settings, () =>
                MainOrganizationOperation(args.User, () =>
                    _organizationOperations.ApplySettings(args.User, args.Organization.Settings)));
        }

        public void Handle(OrganizationSettingsResetEvent args)
        {
            Handle(() => args.Organization.Users.Where(user => user.Status == OrganizationUserStatus.Accepted).ForEach(user =>
                MainOrganizationOperation(user, () =>
                    _organizationOperations.DiscardSettings(user))));
        }

        public void Handle(OrganizationSettingsTemplateAddedEvent args)
        {
            Handle(args.Organization.Settings, () =>
               args.Organization.Users.Where(user => user.Status == OrganizationUserStatus.Accepted).ForEach(user =>
                    MainOrganizationOperation(user, () =>
                       _organizationOperations.GrantTemplateAccess(user, args.Template))));
        }

        public void Handle(OrganizationSettingsSubscriptionUpdatedEvent args)
        {
            Handle(args.Organization.Settings, () =>
                args.Organization.Users.Where(user => user.Status == OrganizationUserStatus.Accepted).ForEach(user =>
                         MainOrganizationOperation(user, () =>
                            _organizationOperations.ApplySubscriptionSettings(user, args.Organization.Settings))));
        }

        public void Handle(OrganizationSettingsSubscriptionResetEvent args)
        {
            Handle(args.Organization.Settings, () =>
               args.Organization.Users.Where(user => user.Status == OrganizationUserStatus.Accepted).ForEach(user =>
                    MainOrganizationOperation(user, () =>
                       _organizationOperations.DiscardSubscriptionSettings(user))));
        }

        public void Handle(OrganizationUserRemovedEvent args)
        {
            Handle(args.Organization.Settings, () => DiscardOrganizationSettings(args.Organization, args.User));
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

        private void MainOrganizationOperation(OrganizationUser user, Action action)
        {
            if (user.Status != OrganizationUserStatus.Accepted)
                return;

            var mainOrganization = _organizationUserRepository.GetUserMainOrganization(user.Email);
            if (mainOrganization == null || user.Organization == null || mainOrganization.Id != user.Organization.Id)
                return;

            action();
        }

        private void DiscardOrganizationSettings(Organization organization, OrganizationUser user)
        {
            if (user.Status != OrganizationUserStatus.Accepted)
                return;

            var mainOrganization = _organizationUserRepository.GetUserMainOrganization(user.Email);
            if (mainOrganization != null && mainOrganization.Id != organization.Id && mainOrganization.Settings != null)
            {
                _organizationOperations.ApplySettings(user, mainOrganization.Settings);
            }
            else
            {
                _organizationOperations.DiscardSettings(user);
            }
        }
    }
}