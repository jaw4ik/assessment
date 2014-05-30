using easygenerator.DomainModel.Entities;
using System.Linq;

namespace easygenerator.Web.Permissions
{
    public class ObjectivePermissionChecker : IEntityPermissionChecker<Objective>
    {
        private readonly IEntityPermissionChecker<Course> _coursePermissionChecker;

        public ObjectivePermissionChecker(IEntityPermissionChecker<Course> coursePermissionChecker)
        {
            _coursePermissionChecker = coursePermissionChecker;
        }

        public bool HasPermissions(string username, Objective objective)
        {
            return objective.CreatedBy == username ||
                   objective.Courses.Any(course => _coursePermissionChecker.HasPermissions(username, course));
        }
    }
}