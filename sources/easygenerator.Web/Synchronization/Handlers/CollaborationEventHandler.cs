using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using easygenerator.Web.Security.FeatureAvailability;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;
using System.Collections.Generic;
using System.Linq;
using WebGrease.Css.Extensions;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class CollaborationEventHandler :
        IDomainEventHandler<CourseCollaboratorAddedEvent>,
        IDomainEventHandler<CourseCollaboratorRemovedEvent>,
        IDomainEventHandler<CollaborationAcceptedEvent>,
        IDomainEventHandler<CollaborationDeclinedEvent>,
        IDomainEventHandler<UserSignedUpEvent>,
        IDomainEventHandler<UserDowngraded>,
        IDomainEventHandler<UserUpgradedToStarter>,
        IDomainEventHandler<UserUpgradedToPlus>
    {
        private readonly IUserCollaborationBroadcaster _userBroadcaster;
        private readonly ICollaborationBroadcaster<Course> _courseCollaborationBroadcaster;
        private readonly ICourseRepository _courseRepository;
        private readonly IEntityMapper _entityMapper;
        private readonly IFeatureAvailabilityChecker _featureAvailabilityCheker;
        private readonly ICourseCollaboratorRepository _collaboratorRepository;
        private readonly ICollaborationInviteMapper _collaborationInviteMapper;

        public CollaborationEventHandler(IUserCollaborationBroadcaster userBroadcaster, ICourseRepository courseRepository, IEntityMapper entityMapper,
            ICollaborationBroadcaster<Course> courseCollaborationBroadcaster, IFeatureAvailabilityChecker featureAvailabilityCheker, ICourseCollaboratorRepository collaboratorRepository,
            ICollaborationInviteMapper collaborationInviteMapper)
        {
            _userBroadcaster = userBroadcaster;
            _courseRepository = courseRepository;
            _entityMapper = entityMapper;
            _courseCollaborationBroadcaster = courseCollaborationBroadcaster;
            _featureAvailabilityCheker = featureAvailabilityCheker;
            _collaboratorRepository = collaboratorRepository;
            _collaborationInviteMapper = collaborationInviteMapper;
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

            if (args.Collaborator.Locked || args.Collaborator.IsAccepted)
                return;

            NotifyCollaborationInviteCreated(args.Collaborator);
        }

        public void Handle(CourseCollaboratorRemovedEvent args)
        {
            _courseCollaborationBroadcaster.AllCollaboratorsExcept(args.Course, args.Course.CreatedBy, args.Collaborator.Email)
                .collaboratorRemoved(args.Course.Id.ToNString(), args.Collaborator.Email);

            if (!args.Collaborator.Locked)
            {
                if (args.Collaborator.IsAccepted)
                {
                    _courseCollaborationBroadcaster.User(args.Collaborator.Email).courseCollaborationFinished(args.Course.Id.ToNString());
                }
                else
                {
                    NotifyCollaborationInviteRemoved(args.Collaborator);
                }
            }

            NotifyIfCollaborationUnlockedAfterCollaboratorDrop(args.Course, args.Collaborator);
        }

        public void Handle(CollaborationDeclinedEvent args)
        {
            _courseCollaborationBroadcaster.AllCollaboratorsExcept(args.Course, args.Collaborator.Email)
               .collaboratorRemoved(args.Course.Id.ToNString(), args.Collaborator.Email);

            NotifyIfCollaborationUnlockedAfterCollaboratorDrop(args.Course, args.Collaborator);
        }

        public void Handle(CollaborationAcceptedEvent args)
        {
            _userBroadcaster.User(args.Collaborator.Email)
                 .courseCollaborationStarted(_entityMapper.Map(args.Collaborator.Course),
                     args.Collaborator.Course.RelatedObjectives.Select(o => _entityMapper.Map(o)),
                     _entityMapper.Map(args.Collaborator.Course.Template));
        }

        public void Handle(UserDowngraded args)
        {
            _collaboratorRepository.LockCollaboration(args.User.Email);
            NotifyCoursesCollaborationLocked(args.User.Email, _courseRepository.GetOwnedCourses(args.User.Email));
        }

        public void Handle(UserUpgradedToStarter args)
        {
            _collaboratorRepository.UnlockCollaboration(args.User.Email, Constants.Collaboration.MaxCollaboratorsCountForStarterPlan);

            var coursesToEnabledCollaboration =
                _courseRepository.GetOwnedCourses(args.User.Email)
                .Where(e => e.Collaborators.Count() <= Constants.Collaboration.MaxCollaboratorsCountForStarterPlan);

            NotifyCoursesCollaborationUnlocked(args.User.Email, coursesToEnabledCollaboration);
        }

        public void Handle(UserUpgradedToPlus args)
        {
            _collaboratorRepository.UnlockCollaboration(args.User.Email);
            NotifyCoursesCollaborationUnlocked(args.User.Email, _courseRepository.GetOwnedCourses(args.User.Email));
        }

        #region Private methods

        private void NotifyIfCollaborationUnlockedAfterCollaboratorDrop(Course course, CourseCollaborator collaborator)
        {
            var isCollaborationEnabled = _featureAvailabilityCheker.IsCourseCollaborationEnabled(course);
            var hasJustEnabledCollaboration = isCollaborationEnabled && course.Collaborators.Count() == _featureAvailabilityCheker.GetMaxAllowedCollaboratorsAmount(course);

            if (!hasJustEnabledCollaboration)
                return;

            _courseCollaborationBroadcaster.AllCollaboratorsExcept(course, collaborator.CreatedBy, collaborator.Email)
                .courseCollaborationStarted(_entityMapper.Map(course),
                    course.RelatedObjectives.Select(o => _entityMapper.Map(o)),
                    _entityMapper.Map(course.Template));

            foreach (var invitedCollaborator in course.Collaborators.Where(c => !c.IsAccepted))
            {
                NotifyCollaborationInviteCreated(invitedCollaborator);
            }
        }

        private void NotifyCoursesCollaborationLocked(string username, IEnumerable<Course> courses)
        {
            if (!courses.Any())
                return;

            courses.ForEach(c => _courseCollaborationBroadcaster.AllCollaboratorsExcept(c, username).courseCollaborationFinished(c.Id.ToNString()));
            GetInvitedCollaborators(courses).ForEach(NotifyCollaborationInviteRemoved);
        }

        private void NotifyCoursesCollaborationUnlocked(string username, IEnumerable<Course> courses)
        {
            if (!courses.Any())
                return;

            courses.ForEach(c => _courseCollaborationBroadcaster.AllCollaboratorsExcept(c, username).
                courseCollaborationStarted(_entityMapper.Map(c), c.RelatedObjectives.Select(o => _entityMapper.Map(o)), _entityMapper.Map(c.Template)));

            GetInvitedCollaborators(courses).ForEach(NotifyCollaborationInviteCreated);
        }

        private void NotifyCollaborationInviteCreated(CourseCollaborator collaborator)
        {
            _courseCollaborationBroadcaster.User(collaborator.Email).collaborationInviteCreated(MapCollaborationInvite(collaborator));
        }

        private void NotifyCollaborationInviteRemoved(CourseCollaborator collaborator)
        {
            _courseCollaborationBroadcaster.User(collaborator.Email).collaborationInviteRemoved(collaborator.Id.ToNString());
        }

        private IEnumerable<CourseCollaborator> GetInvitedCollaborators(IEnumerable<Course> courses)
        {
            return courses.SelectMany(course => course.Collaborators.Where(c => !c.IsAccepted));
        } 

        private object MapCollaborationInvite(CourseCollaborator collaborator)
        {
            var invite = _collaboratorRepository.GetCollaborationInvite(collaborator);
            return _collaborationInviteMapper.Map(invite);
        }

        #endregion

    }
}