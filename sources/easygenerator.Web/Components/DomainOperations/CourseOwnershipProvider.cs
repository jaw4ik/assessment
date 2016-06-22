using easygenerator.DomainModel.Entities;
using System.Linq;

namespace easygenerator.Web.Components.DomainOperations
{
    public class CourseOwnershipProvider
    {
        public virtual CourseOwnership GetCourseOwnership(Course course, string username)
        {
            var collaborator = course.Collaborators.FirstOrDefault(c => c.Email == username);
            if (collaborator != null)
            {
                return collaborator.IsAdmin ? CourseOwnership.Organization : CourseOwnership.Shared;
            }

            return CourseOwnership.Owned;
        }
    }

    public enum CourseOwnership
    {
        Owned = 0,
        Shared = 1,
        Organization = 2
    }
}