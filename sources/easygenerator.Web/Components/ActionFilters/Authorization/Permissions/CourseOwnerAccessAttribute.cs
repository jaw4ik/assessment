using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Components.ActionFilters.Authorization.Permissions
{
    public class CourseOwnerAccessAttribute : CoursePermissionAttribute
    {
        protected override bool CheckAccessToCourse(Course course, User user)
        {
            return course.CreatedBy == user.Email;
        }
    }
}