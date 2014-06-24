using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using System;
using System.Linq;

namespace easygenerator.Web.Permissions
{
    public class CoursePermissionsChecker : IEntityPermissionsChecker<Course>
    {
        private IUserRepository _userRepository;

        public CoursePermissionsChecker(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public bool HasPermissions(string username, Course course)
        {
            return IsOwner(username, course) || HasCollaboratorPermissions(username, course);
        }

        private bool IsOwner(string username, Course course)
        {
            return course.CreatedBy == username;
        }

        private bool HasCollaboratorPermissions(string username, Course course)
        {
            return course.Collaborators.Any(e => e.Email == username) && IsCollaborationEnabled(course);
        }

        private bool IsCollaborationEnabled(Course course)
        {
            var owner = _userRepository.GetUserByEmail(course.CreatedBy);
            switch (owner.AccessType)
            {
                case AccessType.Free:
                    return false;
                case AccessType.Starter:
                    return course.Collaborators.Count() <= Constants.Collaboration.MaxCollaboratorsCountForStarterPlan;
                default:
                    return false;
            }
        }
    }
}