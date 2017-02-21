using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.OrganizationEvents;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Components.Mappers.Organizations;
using easygenerator.Web.Extensions;
using easygenerator.Web.Synchronization.Broadcasting.OrganizationBroadcasting;
using System.Web;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class OrganizationEventHandler :
        IDomainEventHandler<UserSignedUpEvent>,
        IDomainEventHandler<OrganizationInviteAcceptedEvent>,
        IDomainEventHandler<OrganizationInviteDeclinedEvent>,
        IDomainEventHandler<OrganizationUserRemovedEvent>,
        IDomainEventHandler<OrganizationUserAddedEvent>,
        IDomainEventHandler<OrganizationTitleUpdatedEvent>,
        IDomainEventHandler<OrganizationUserReinvitedEvent>,
        IDomainEventHandler<OrganizationUserUpdateAdminPermissions>
    {
        private readonly IOrganizationBroadcaster _organizationBroadcaster;
        private readonly IOrganizationUserBroadcaster _organizationUserBroadcaster;
        private readonly IOrganizationInviteMapper _organizationInviteMapper;
        private readonly IOrganizationUserRepository _organizationUserRepository;
        private readonly IOrganizationMapper _organizationMapper;
        private readonly IEntityMapper _entityMapper;

        public OrganizationEventHandler(IOrganizationBroadcaster organizationBroadcaster, IOrganizationUserBroadcaster organizationUserBroadcaster,
            IOrganizationInviteMapper organizationInviteMapper, IOrganizationUserRepository organizationUserRepository,
            IOrganizationMapper organizationMapper, IEntityMapper entityMapper)
        {
            _organizationBroadcaster = organizationBroadcaster;
            _organizationUserBroadcaster = organizationUserBroadcaster;
            _organizationInviteMapper = organizationInviteMapper;
            _organizationUserRepository = organizationUserRepository;
            _organizationMapper = organizationMapper;
            _entityMapper = entityMapper;
        }

        protected string CurrentUsername
        {
            get { return HttpContext.Current.User.Identity.Name; }
        }

        public void Handle(UserSignedUpEvent args)
        {
            _organizationUserBroadcaster.OrganizationAdmins(args.User.Email)
               .organizationUserRegistered(args.User.Email, args.User.FullName);
        }

        public void Handle(OrganizationInviteAcceptedEvent args)
        {
            _organizationBroadcaster.OrganizationAdmins(args.Organization)
                .organizationInviteAccepted(args.User.Id.ToNString());

            _organizationBroadcaster.User(args.User.Email)
                .organizationMembershipStarted(_organizationMapper.Map(args.Organization, CurrentUsername));
        }

        public void Handle(OrganizationInviteDeclinedEvent args)
        {
            _organizationBroadcaster.OrganizationAdmins(args.Organization)
               .organizationInviteDeclined(args.Organization.Id.ToNString(), args.User.Id.ToNString());
        }

        public void Handle(OrganizationUserRemovedEvent args)
        {
            if (args.User.Status == OrganizationUserStatus.WaitingForAcceptance)
            {
                _organizationBroadcaster.User(args.User.Email)
                    .organizationInviteRemoved(args.User.Id.ToNString());
            }

            _organizationBroadcaster.User(args.User.Email)
                .organizationMembershipFinished(args.Organization.Id.ToNString());
        }

        public void Handle(OrganizationUserAddedEvent args)
        {
            var invite = _organizationUserRepository.GetOrganizationInvite(args.User);
            if (invite != null)
            {
                _organizationUserBroadcaster.User(args.User.Email)
                    .organizationInviteCreated(_organizationInviteMapper.Map(invite));
            }

            _organizationBroadcaster.OrganizationAdminsExcept(args.Organization, CurrentUsername)
                .organizationUserAdded(args.Organization.Id.ToNString(), _entityMapper.Map(args.User));
        }

        public void Handle(OrganizationTitleUpdatedEvent args)
        {
            _organizationBroadcaster.InvitedUsers(args.Organization)
             .organizationTitleUpdated(args.Organization.Id.ToNString(), args.Organization.Title);

            _organizationBroadcaster.OtherMembers(args.Organization)
             .organizationTitleUpdated(args.Organization.Id.ToNString(), args.Organization.Title);
        }

        public void Handle(OrganizationUserReinvitedEvent args)
        {
            var invite = _organizationUserRepository.GetOrganizationInvite(args.User);
            if (invite != null)
            {
                _organizationUserBroadcaster.User(args.User.Email)
                    .organizationInviteCreated(_organizationInviteMapper.Map(invite));
            }
        }

        public void Handle(OrganizationUserUpdateAdminPermissions args)
        {
            _organizationBroadcaster.User(args.User.Email)
                .organizationMembershipUpdated(args.Organization.Id.ToNString(), _entityMapper.Map(args.User));

            _organizationBroadcaster.OrganizationAdmins(args.Organization)
                .organizationUserUpdated(args.Organization.Id.ToNString(), _entityMapper.Map(args.User));
        }
    }
}