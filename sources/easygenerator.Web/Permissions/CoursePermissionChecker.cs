using easygenerator.DomainModel.Entities;
using System.Linq;

namespace easygenerator.Web.Permissions
{
    public class CoursePermissionChecker : IEntityPermissionChecker<Course>
    {
        public bool HasPermissions(string username, Course course)
        {
            return course.CreatedBy == username || course.Collaborators.Any(e => e.Email == username);
        }
    }
}