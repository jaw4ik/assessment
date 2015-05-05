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

        public CollaborationEventHandler(IUserCollaborationBroadcaster userBroadcaster, ICourseRepository courseRepository, IEntityMapper entityMapper,
            ICollaborationBroadcaster<Course> courseCollaborationBroadcaster, IFeatureAvailabilityChecker featureAvailabilityCheker, ICourseCollaboratorRepository collaboratorRepository)
        {
            _userBroadcaster = userBroadcaster;
            _courseRepository = courseRepository;
            _entityMapper = entityMapper;
            _courseCollaborationBroadcaster = courseCollaborationBroadcaster;
            _featureAvailabilityCheker = featureAvailabilityCheker;
            _collaboratorRepository = collaboratorRepository;
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
        }


        public void Handle(CourseCollaboratorRemovedEvent args)
        {
            _courseCollaborationBroadcaster.AllCollaboratorsExcept(args.Course, args.Course.CreatedBy, args.Collaborator.Email)
                .collaboratorRemoved(args.Course.Id.ToNString(), args.Collaborator.Email);

            _courseCollaborationBroadcaster.User(args.Collaborator.Email)
                .courseCollaborationFinished(args.Course.Id.ToNString());

            NotifyUsersIfCollaborationHasBeenUnlockedAfterCollaboratorDrop(args.Course, args.Collaborator);
        }

        public void Handle(CollaborationDeclinedEvent args)
        {
            _courseCollaborationBroadcaster.AllCollaboratorsExcept(args.Course, args.Collaborator.Email)
               .collaboratorRemoved(args.Course.Id.ToNString(), args.Collaborator.Email);

            NotifyUsersIfCollaborationHasBeenUnlockedAfterCollaboratorDrop(args.Course, args.Collaborator);
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
            FinishCoursesCollaboration(args.User.Email, _courseRepository.GetOwnedCourses(args.User.Email));
        }

        public void Handle(UserUpgradedToStarter args)
        {
            _collaboratorRepository.UnlockCollaboration(args.User.Email, Constants.Collaboration.MaxCollaboratorsCountForStarterPlan);

            var coursesToEnabledCollaboration =
                _courseRepository.GetOwnedCourses(args.User.Email)
                .Where(e => e.Collaborators.Count() <= Constants.Collaboration.MaxCollaboratorsCountForStarterPlan);

            StartCoursesCollaboration(args.User.Email, coursesToEnabledCollaboration);
        }

        public void Handle(UserUpgradedToPlus args)
        {
            _collaboratorRepository.UnlockCollaboration(args.User.Email);
            StartCoursesCollaboration(args.User.Email, _courseRepository.GetOwnedCourses(args.User.Email));
        }

        #region Private methods

        private void NotifyUsersIfCollaborationHasBeenUnlockedAfterCollaboratorDrop(Course course, CourseCollaborator collaborator)
        {
            var isCollaborationEnabled = _featureAvailabilityCheker.IsCourseCollaborationEnabled(course);
            var hasJustEnabledCollaboration = isCollaborationEnabled && course.Collaborators.Count() == _featureAvailabilityCheker.GetMaxAllowedCollaboratorsAmount(course);

            if (hasJustEnabledCollaboration)
            {
                _courseCollaborationBroadcaster.AllCollaboratorsExcept(course, collaborator.CreatedBy, collaborator.Email)
                        .courseCollaborationStarted(_entityMapper.Map(course),
                        course.RelatedObjectives.Select(o => _entityMapper.Map(o)),
                        _entityMapper.Map(course.Template));
            }
        }

        private void FinishCoursesCollaboration(string username, IEnumerable<Course> courses)
        {
            if (!courses.Any())
                return;

            courses.ForEach(c => _courseCollaborationBroadcaster.AllCollaboratorsExcept(c, username).courseCollaborationFinished(c.Id.ToNString()));
        }


        private void StartCoursesCollaboration(string username, IEnumerable<Course> courses)
        {
            if (!courses.Any())
                return;

            courses.ForEach(c => _courseCollaborationBroadcaster.AllCollaboratorsExcept(c, username).
                courseCollaborationStarted(_entityMapper.Map(c), c.RelatedObjectives.Select(o => _entityMapper.Map(o)), _entityMapper.Map(c.Template)));
        }

        #endregion

    }
}