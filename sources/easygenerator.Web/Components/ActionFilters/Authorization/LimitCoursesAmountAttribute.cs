using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities.Users;

namespace easygenerator.Web.Components.ActionFilters.Authorization
{
    public class LimitCoursesAmountAttribute : AccessAttribute
    {
        protected const int FreeLimit = 10;
        protected const int StarterLimit = 50;

        public ICourseRepository CourseRepository { get; set; }

        public LimitCoursesAmountAttribute()
        {
            ErrorMessageResourceKey = Errors.UpgradeToNextPlanToCreateMoreCoursesErrorMessage;
        }

        protected override bool CheckAccess(AuthorizationContext authorizationContext, User user)
        {
            if (user.HasPlusAccess())
            {
                return true;
            }

            var userName = authorizationContext.HttpContext.User.Identity.Name;
            var coursesCount = CourseRepository.GetCollection(course => course.CreatedBy == userName).Count;
            var limit = user.HasStarterAccess() ? StarterLimit : FreeLimit;

            return coursesCount < limit;
        }
    }
}