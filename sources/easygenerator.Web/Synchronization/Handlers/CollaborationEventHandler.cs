using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents.Collaboration;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;
using System.Linq;
using System.Web;
using easygenerator.Web.Components.DomainOperations.CourseOperations;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class CollaborationEventHandler :
        IDomainEventHandler<CourseCollaboratorAddedEvent>,
        IDomainEventHandler<CourseCollaboratorRemovedEvent>,
        IDomainEventHandler<CollaborationInviteAcceptedEvent>,
        IDomainEventHandler<CollaborationInviteDeclinedEvent>,
        IDomainEventHandler<UserSignedUpEvent>,
        IDomainEventHandler<CourseCollaboratorAdminAccessGrantedEvent>
    {
        private readonly IUserCollaborationBroadcaster _userBroadcaster;
        private readonly ICollaborationBroadcaster<Course> _courseCollaborationBroadcaster;
        private readonly IEntityMapper _entityMapper;
        private readonly ICourseCollaboratorRepository _collaboratorRepository;
        private readonly ICollaborationInviteMapper _collaborationInviteMapper;
        private readonly CourseOwnershipProvider _courseOwnershipProvider;

        public CollaborationEventHandler(IUserCollaborationBroadcaster userBroadcaster, IEntityMapper entityMapper,
            ICollaborationBroadcaster<Course> courseCollaborationBroadcaster, ICourseCollaboratorRepository collaboratorRepository,
            ICollaborationInviteMapper collaborationInviteMapper, CourseOwnershipProvider courseOwnershipProvider)
        {
            _userBroadcaster = userBroadcaster;
            _entityMapper = entityMapper;
            _courseCollaborationBroadcaster = courseCollaborationBroadcaster;
            _collaboratorRepository = collaboratorRepository;
            _collaborationInviteMapper = collaborationInviteMapper;
            _courseOwnershipProvider = courseOwnershipProvider;
        }

        protected string CurrentUsername
        {
            get { return HttpContext.Current.User.Identity.Name; }
        }

        public void Handle(UserSignedUpEvent args)
        {
            _userBroadcaster.OtherCollaborators(args.User.Email)
                .collaboratorRegistered(args.User.Email, args.User.FullName);
        }

        public void Handle(CourseCollaboratorAddedEvent args)
        {
            _courseCollaborationBroadcaster.AllCollaboratorsExcept(args.Collaborator.Course, args.Collaborator.Email, args.Collaborator.CreatedBy)
               .courseCollaboratorAdded(
                   args.Collaborator.Course.Id.ToNString(),
                   _entityMapper.Map(args.Collaborator));

            if (args.Collaborator.IsAccepted)
            {
                _userBroadcaster.User(args.Collaborator.Email)
                 .courseCollaborationStarted(_entityMapper.Map(args.Collaborator.Course, args.Collaborator.Email),
                     args.Collaborator.Course.RelatedSections.Select(o => _entityMapper.Map(o)),
                     _entityMapper.Map(args.Collaborator.Course.Template));

                return;
            }

            NotifyCollaborationInviteCreated(args.Collaborator);
        }

        public void Handle(CourseCollaboratorRemovedEvent args)
        {
            _courseCollaborationBroadcaster.OtherCollaborators(args.Course)
                .collaboratorRemoved(args.Course.Id.ToNString(), args.Collaborator.Email);

            if (args.Collaborator.IsAccepted)
            {
                _courseCollaborationBroadcaster.User(args.Collaborator.Email)
                    .courseCollaborationFinished(args.Course.Id.ToNString());
            }
            else
            {
                if (CurrentUsername == args.Collaborator.Email)
                    return;

                NotifyCollaborationInviteRemoved(args.Collaborator);
            }
        }

        public void Handle(CollaborationInviteDeclinedEvent args)
        {
            _courseCollaborationBroadcaster.AllCollaboratorsExcept(args.Course, args.Collaborator.Email)
               .collaboratorRemoved(args.Course.Id.ToNString(), args.Collaborator.Email);
        }

        public void Handle(CollaborationInviteAcceptedEvent args)
        {
            _userBroadcaster.User(args.Collaborator.Email)
                 .courseCollaborationStarted(_entityMapper.Map(args.Collaborator.Course, args.Collaborator.Email),
                     args.Collaborator.Course.RelatedSections.Select(o => _entityMapper.Map(o)),
                     _entityMapper.Map(args.Collaborator.Course.Template));

            _courseCollaborationBroadcaster.AllCollaboratorsExcept(args.Course, args.Collaborator.Email)
                .collaborationInviteAccepted(args.Course.Id.ToNString(), args.Collaborator.Email);
        }

        public void Handle(CourseCollaboratorAdminAccessGrantedEvent args)
        {
            _courseCollaborationBroadcaster.AllCollaborators(args.Course)
               .collaboratorAccessTypeUpdated(args.Course.Id.ToNString(), args.Collaborator.Id.ToNString(), args.Collaborator.IsAdmin);

            _userBroadcaster.User(args.Collaborator.Email)
               .courseOwnershipUpdated(args.Course.Id.ToNString(), _courseOwnershipProvider.GetCourseOwnership(args.Course, args.Collaborator.Email));
        }

        #region Private methods

        private void NotifyCollaborationInviteCreated(CourseCollaborator collaborator)
        {
            _courseCollaborationBroadcaster.User(collaborator.Email).collaborationInviteCreated(MapCollaborationInvite(collaborator));
        }

        private void NotifyCollaborationInviteRemoved(CourseCollaborator collaborator)
        {
            _courseCollaborationBroadcaster.User(collaborator.Email).collaborationInviteRemoved(collaborator.Id.ToNString());
        }


        private object MapCollaborationInvite(CourseCollaborator collaborator)
        {
            var invite = _collaboratorRepository.GetCollaborationInvite(collaborator);
            return _collaborationInviteMapper.Map(invite);
        }

        #endregion
    }
}