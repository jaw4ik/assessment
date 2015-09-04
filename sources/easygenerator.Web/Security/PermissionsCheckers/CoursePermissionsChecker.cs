using easygenerator.DomainModel.Entities;
using System;
using System.Linq;

namespace easygenerator.Web.Security.PermissionsCheckers
{
    public class CoursePermissionsChecker : EntityPermissionsChecker<Course>
    {
        public override bool HasCollaboratorPermissions(string username, Course course)
        {
            return HasOwnerPermissions(username, course) ||
                (course.Collaborators.Any(e => e.Email.Equals(username, StringComparison.InvariantCultureIgnoreCase) && e.IsAccepted));
        }
    }
}