using easygenerator.DomainModel.Entities;
using System.Linq;

namespace easygenerator.Web.Permissions
{
    public class ObjectivePermissionsChecker : IEntityPermissionsChecker<Objective>
    {
        private readonly IEntityPermissionsChecker<Course> _coursePermissionChecker;

        public ObjectivePermissionsChecker(IEntityPermissionsChecker<Course> coursePermissionChecker)
        {
            _coursePermissionChecker = coursePermissionChecker;
        }

        public bool HasCollaboratorPermissions(string username, Objective objective)
        {
            return objective.CreatedBy == username ||
                   objective.Courses.Any(course => _coursePermissionChecker.HasCollaboratorPermissions(username, course));
        }
    }
}