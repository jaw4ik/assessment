using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Components.ActionFilters.Authorization.Permissions
{
    public class CoursePermissionAttribute : CourseAccessAttribute
    {
        protected override bool CheckAccessToCourse(Course course, User user)
        {
            return course.IsPermittedTo(user.Email);
        }
    }
}