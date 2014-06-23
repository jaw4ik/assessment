using System;
using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting
{
    public class UserCollaborationBroadcaster : Broadcaster, IUserCollaborationBroadcaster
    {
        private readonly ICourseCollaboratorRepository _repository;

        public UserCollaborationBroadcaster(ICourseCollaboratorRepository repository)
        {
            _repository = repository;
        }

        public dynamic AllUserCollaborators(string userEmail)
        {
            var sharedCourses = GetUserSharedCourses(userEmail);
            var collaborators = GetCollaborators(sharedCourses);

            return Users(collaborators.Except(new[] {userEmail}, StringComparer.OrdinalIgnoreCase));
        }

        private ICollection<Course> GetUserSharedCourses(string userEmail)
        {
            return _repository.GetSharedCourses(userEmail);
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