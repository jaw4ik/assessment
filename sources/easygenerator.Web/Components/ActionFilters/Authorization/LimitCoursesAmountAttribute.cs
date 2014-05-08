using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using System.Web.Mvc;

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
            if (user == null)
                return false;

            var coursesCount = CourseRepository.GetCollection(course => course.CreatedBy == authorizationContext.HttpContext.User.Identity.Name).Count;
            var limit = user.HasStarterAccess() ? StarterLimit : FreeLimit;

            return coursesCount < limit;
        }
    }
}