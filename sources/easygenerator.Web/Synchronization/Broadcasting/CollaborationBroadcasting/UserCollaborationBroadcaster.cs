using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using System.Collections.Generic;
using System.Linq;

namespace easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting
{
    public class UserCollaborationBroadcaster : Broadcaster, IUserCollaborationBroadcaster
    {
        private readonly ICourseCollaboratorRepository _collaborationRepository;
        private readonly ICourseRepository _courseRepository;

        public UserCollaborationBroadcaster(ICourseCollaboratorRepository collaborationRepository, ICourseRepository courseRepository)
        {
            _collaborationRepository = collaborationRepository;
            _courseRepository = courseRepository;
        }

        public dynamic OtherCollaborators(string userEmail)
        {
            var collaborators = GetCollaborators(_collaborationRepository.GetSharedCourses(userEmail));

            return UsersExcept(collaborators, userEmail);
        }

        public dynamic OtherCollaboratorsOnOwnedCourses(string userEmail)
        {
            var collaborators = GetCollaborators(_courseRepository.GetOwnedCourses(userEmail));

            return UsersExcept(collaborators, userEmail);
        }

        private IEnumerable<string> GetCollaborators(IEnumerable<Course> sharedCourses)
        {
            var collaborators = new List<string>();

            foreach (var course in sharedCourses)
            {
                var users = course.Collaborators.Select(c => c.Email).ToList();
                users.Add(course.CreatedBy);
                collaborators.AddRange(users);
            }

            return collaborators.Distinct();
        }

    }
}