using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using easygenerator.Web.Permissions;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;
using System.Collections.Generic;
using System.Linq;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class UserCollaborationEventHandler :
        IDomainEventHandler<CourseCollaboratorAddedEvent>,
        IDomainEventHandler<UserSignedUpEvent>,
        IDomainEventHandler<UserDonwgraded>,
        IDomainEventHandler<UserUpgradedToStarter>,
        IDomainEventHandler<UserUpgradedToPlus>
    {
        private readonly IUserCollaborationBroadcaster _userBroadcaster;
        private readonly ICollaborationBroadcaster<Course> _courseCollaborationBroadcaster;
        private readonly ICourseRepository _courseRepository;
        private readonly IEntityMapper _entityMapper;
        private readonly IEntityPermissionsChecker<Course> _coursePermissionsChecker;

        public UserCollaborationEventHandler(IUserCollaborationBroadcaster userBroadcaster, ICourseRepository courseRepository, IEntityMapper entityMapper,
            ICollaborationBroadcaster<Course> courseCollaborationBroadcaster, IEntityPermissionsChecker<Course> coursePermissionsChecker )
        {
            _userBroadcaster = userBroadcaster;
            _courseRepository = courseRepository;
            _entityMapper = entityMapper;
            _courseCollaborationBroadcaster = courseCollaborationBroadcaster;
            _coursePermissionsChecker = coursePermissionsChecker;
        }

        public void Handle(UserSignedUpEvent args)
        {
            _userBroadcaster.OtherCollaborators(args.User.Email)
                .collaboratorRegistered(args.User.Email, args.User.FullName);
        }

        public void Handle(CourseCollaboratorAddedEvent args)
        {
            _courseCollaborationBroadcaster.AllCollaboratorsExcept(args.Collaborator.Course, args.Collaborator.Email, args.AddedBy)
                .courseCollaboratorAdded(
                    args.Collaborator.Course.Id.ToNString(),
                    _entityMapper.Map(args.Collaborator));

            if (!_coursePermissionsChecker.HasCollaboratorPermissions(args.Collaborator.Email, args.Collaborator.Course))
                return;

            _userBroadcaster.User(args.Collaborator.Email)
                 .courseCollaborationStarted(
                     _entityMapper.Map(args.Collaborator.Course),
                     args.Collaborator.Course.RelatedObjectives.Select(o => _entityMapper.Map(o)));
        }

        public void Handle(UserDonwgraded args)
        {
            DisableCoursesCollaboration(args.User.Email, _courseRepository.GetOwnedCourses(args.User.Email));
        }

        public void Handle(UserUpgradedToStarter args)
        {
            var coursesToDisableCollaboration =
                _courseRepository.GetOwnedCourses(args.User.Email)
                .Where(e => e.Collaborators.Count() > Constants.Collaboration.MaxCollaboratorsCountForStarterPlan);

            DisableCoursesCollaboration(args.User.Email, coursesToDisableCollaboration);

            var coursesToEnabledCollaboration =
                _courseRepository.GetOwnedCourses(args.User.Email)
                .Where(e => e.Collaborators.Count() <= Constants.Collaboration.MaxCollaboratorsCountForStarterPlan);

            EnableCoursesCollaboration(args.User.Email, coursesToEnabledCollaboration);
        }

        public void Handle(UserUpgradedToPlus args)
        {
            EnableCoursesCollaboration(args.User.Email, _courseRepository.GetOwnedCourses(args.User.Email));
        }

        public void DisableCoursesCollaboration(string userEmail, IEnumerable<Course> courses)
        {
            if (!courses.Any())
                return;

            _userBroadcaster.OtherCollaboratorsOnOwnedCourses(userEmail)
                .collaborationDisabled(courses.Select(course => course.Id.ToNString()));
        }

        public void EnableCoursesCollaboration(string userEmail, IEnumerable<Course> courses)
        {
            if (!courses.Any())
                return;

            foreach (var course in courses)
            {
                _courseCollaborationBroadcaster.AllCollaboratorsExcept(course, userEmail)
                    .courseCollaborationStarted(_entityMapper.Map(course), course.RelatedObjectives.Select(o => _entityMapper.Map(o)));
            }
        }
    }
}