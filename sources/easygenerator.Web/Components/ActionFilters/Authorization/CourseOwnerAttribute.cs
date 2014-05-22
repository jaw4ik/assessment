using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Extensions;
using System;
using System.Web.Mvc;

namespace easygenerator.Web.Components.ActionFilters.Authorization
{
    public class CourseOwnerAttribute : AccessAttribute
    {
        public ICourseRepository CourseRepository { get; set; }

        public CourseOwnerAttribute()
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
            if (course == null)
                throw new ArgumentException("Course with specified id was not found");

            return course.CreatedBy == user.Email;
        }
    }
}