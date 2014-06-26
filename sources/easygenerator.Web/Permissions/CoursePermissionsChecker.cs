using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using System.Linq;

namespace easygenerator.Web.Permissions
{
    public class CoursePermissionsChecker : EntityPermissionsChecker<Course>
    {
        private readonly IUserRepository _userRepository;

        public CoursePermissionsChecker(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public override bool HasCollaboratorPermissions(string username, Course course)
        {
            return HasOwnerPermissions(username, course) || 
                (course.Collaborators.Any(e => e.Email == username) && IsCollaborationEnabled(course));
        }

        private bool IsCollaborationEnabled(Course course)
        {
            var owner = _userRepository.GetUserByEmail(course.CreatedBy);
            if (owner.HasPlusAccess())
                return true;

            if(owner.HasStarterAccess())
                return course.Collaborators.Count() <= Constants.Collaboration.MaxCollaboratorsCountForStarterPlan;

            return false;
        }
    }
}