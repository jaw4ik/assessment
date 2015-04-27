using System.Linq;
using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Security.PermissionsCheckers
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