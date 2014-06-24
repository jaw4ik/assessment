using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Extensions;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;
using System.Collections.Generic;
using System.Linq;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class UserCollaborationEventHandler :
        IDomainEventHandler<UserSignedUpEvent>,
        IDomainEventHandler<UserDonwgraded>,
        IDomainEventHandler<UserUpgradedToStarter>
    {
        private readonly IUserCollaborationBroadcaster _broadcaster;
        private readonly ICourseRepository _courseRepository;
        private const int MaxCollaboratorsCountForStarterPlan = 3;

        public UserCollaborationEventHandler(IUserCollaborationBroadcaster broadcaster, ICourseRepository courseRepository)
        {
            _broadcaster = broadcaster;
            _courseRepository = courseRepository;
        }

        public void Handle(UserSignedUpEvent args)
        {
            _broadcaster.OtherCollaborators(args.User.Email)
                .collaboratorRegistered(args.User.Email, args.User.FullName);
        }

        public void Handle(UserDonwgraded args)
        {
            BroadcastCollaborationDisabledMessage(args.User.Email, _courseRepository.GetOwnedCourses(args.User.Email));
        }

        public void Handle(UserUpgradedToStarter args)
        {
            var courses =
                _courseRepository.GetOwnedCourses(args.User.Email)
                .Where(course => course.Collaborators.Count() > MaxCollaboratorsCountForStarterPlan);

            BroadcastCollaborationDisabledMessage(args.User.Email, courses);
        }

        public void BroadcastCollaborationDisabledMessage(string userEmail, IEnumerable<Course> courses)
        {
            if (!courses.Any())
                return;

            _broadcaster.OtherCollaboratorsOnOwnedCourses(userEmail)
                .collaborationDisabled(courses.Select(course => course.Id.ToNString()));
        }
    }
}