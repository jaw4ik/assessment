using System.Linq;
using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Security.PermissionsCheckers
{
    public class SectionPermissionsChecker : EntityPermissionsChecker<Section>
    {
        private readonly IEntityPermissionsChecker<Course> _coursePermissionChecker;

        public SectionPermissionsChecker(IEntityPermissionsChecker<Course> coursePermissionChecker)
        {
            _coursePermissionChecker = coursePermissionChecker;
        }

        public override bool HasCollaboratorPermissions(string username, Section section)
        {
            return HasOwnerPermissions(username, section) ||
                   section.Courses.Any(course => _coursePermissionChecker.HasCollaboratorPermissions(username, course));
        }
    }
}