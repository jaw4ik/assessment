using System;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.ActionFilters.Authorization.Permissions
{
    public abstract class CoursePermissionAttribute : AccessAttribute
    {
        public ICourseRepository CourseRepository { get; set; }

        protected CoursePermissionAttribute()
        {
            ErrorMessageResourceKey = Errors.NotEnoughPermissionsErrorMessage;
        }

        protected override bool CheckAccess(AuthorizationContext authorizationContext, User user)
        {
            if (user == null)
                return false;

            var courseId = authorizationContext.Controller.ValueProvider.GetGuidValue("courseId");
            if (!courseId.HasValue)
                throw new ArgumentNullException("courseId");

            var course = CourseRepository.Get(courseId.Value);
            return course == null || CheckAccessToCourse(course, user);
        }

        protected abstract bool CheckAccessToCourse(Course course, User user);
    }
}