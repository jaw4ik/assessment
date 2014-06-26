using easygenerator.DomainModel.Entities;
using System.Linq;

namespace easygenerator.Web.Permissions
{
    public class ObjectivePermissionsChecker : EntityPermissionsChecker<Objective>
    {
        private readonly IEntityPermissionsChecker<Course> _coursePermissionChecker;

        public ObjectivePermissionsChecker(IEntityPermissionsChecker<Course> coursePermissionChecker)
        {
            _coursePermissionChecker = coursePermissionChecker;
        }

        public override bool HasCollaboratorPermissions(string username, Objective objective)
        {
            return HasOwnerPermissions(username, objective) ||
                   objective.Courses.Any(course => _coursePermissionChecker.HasCollaboratorPermissions(username, course));
        }
    }
}