using System.Web.Mvc;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;

namespace easygenerator.Web.Components.ActionFilters.Authorization
{
    public class LimitCoursesAmountAttribute : AccessAttribute
    {
        protected const int _freeLimit = 10;
        protected const int _starterLimit = 50;

        public ICourseRepository CourseRepository { get; set; }

        public LimitCoursesAmountAttribute()
        {
            ErrorMessageResourceKey = Errors.UpgradeToNextPlanToCreateMoreCoursesErrorMessage;
        }

        protected override bool CheckAccess(AuthorizationContext authorizationContext, User user)
        {
            int coursesCount = CourseRepository.GetCollection(course => course.CreatedBy == authorizationContext.HttpContext.User.Identity.Name).Count;
            if (user.HasStarterAccess())
            {
                return coursesCount < _starterLimit;
            }
            return coursesCount < _freeLimit;
        }
    }
}