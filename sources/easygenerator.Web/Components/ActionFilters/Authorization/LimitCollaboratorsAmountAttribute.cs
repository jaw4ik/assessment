using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Extensions;
using easygenerator.Web.Security.FeatureAvailability;
using System;
using System.Web.Mvc;

namespace easygenerator.Web.Components.ActionFilters.Authorization
{
    public class LimitCollaboratorsAmountAttribute : AccessAttribute
    {
        public ICourseRepository CourseRepository { get; set; }
        public IFeatureAvailabilityChecker FeatureAvailabilityChecker { get; set; }

        public LimitCollaboratorsAmountAttribute()
        {
            ErrorMessageResourceKey = Errors.NotEnoughPermissionsErrorMessageKey;
        }

        protected override bool CheckAccess(AuthorizationContext authorizationContext, User user)
        {
            var courseId = authorizationContext.Controller.ValueProvider.GetGuidValue("courseId");
            if (!courseId.HasValue)
                throw new ArgumentNullException("courseId");

            var course = CourseRepository.Get(courseId.Value);
            return course != null && FeatureAvailabilityChecker.CanAddCollaborator(course);
        }
    }
}