using System;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class OnboardingController : DefaultApiController
    {
        private readonly IOnboardingRepository _onboardingRepository;

        public OnboardingController(IOnboardingRepository onboardingRepository)
        {
            _onboardingRepository = onboardingRepository;
        }

        [HttpPost]
        [Route("api/onboarding")]
        public ActionResult GetOnboardingStates()
        {
            var onboarding = _onboardingRepository.GetByUserEmail(GetCurrentUsername());
            if (onboarding == null)
            {
                return JsonSuccess();
            }

            if (onboarding.IsClosed)
            {
                return JsonSuccess(new { isClosed = onboarding.IsClosed });
            }

            return
                JsonSuccess(
                    new
                    {
                        courseCreated = onboarding.CourseCreated,
                        objectiveCreated = onboarding.ObjectiveCreated,
                        contentCreated = onboarding.ContentCreated,
                        createdQuestionsCount = onboarding.CreatedQuestionsCount,
                        coursePublished = onboarding.CoursePublished,
                        isClosed = onboarding.IsClosed
                    });
        }

        [HttpPost]
        [Route("api/onboarding/coursecreated")]
        public ActionResult CourseCreated()
        {
            var onboarding = _onboardingRepository.GetByUserEmail(GetCurrentUsername());
            if (onboarding == null)
            {
                return JsonError(String.Empty);
            }

            onboarding.MarkCourseCreatedAsCompleted();
            return JsonSuccess();
        }

        [HttpPost]
        [Route("api/onboarding/objectivecreated")]
        public ActionResult ObjetiveCreated()
        {
            var onboarding = _onboardingRepository.GetByUserEmail(GetCurrentUsername());
            if (onboarding == null)
            {
                return JsonError(String.Empty);
            }

            onboarding.MarkObjectiveCreatedAsCompleted();
            return JsonSuccess();
        }

        [HttpPost]
        [Route("api/onboarding/contentcreated")]
        public ActionResult ContentCreated()
        {
            var onboarding = _onboardingRepository.GetByUserEmail(GetCurrentUsername());
            if (onboarding == null)
            {
                return JsonError(String.Empty);
            }

            onboarding.MarkContentCreatedAsCompleted();
            return JsonSuccess();
        }

        [HttpPost]
        [Route("api/onboarding/questioncreated")]
        public ActionResult QuestionCreated()
        {
            var onboarding = _onboardingRepository.GetByUserEmail(GetCurrentUsername());
            if (onboarding == null)
            {
                return JsonError(String.Empty);
            }

            onboarding.IncreaseCreatedQuestionsCount();
            return JsonSuccess();
        }

        [HttpPost]
        [Route("api/onboarding/coursepublished")]
        public ActionResult CoursePublished()
        {
            var onboarding = _onboardingRepository.GetByUserEmail(GetCurrentUsername());
            if (onboarding == null)
            {
                return JsonError(String.Empty);
            }

            onboarding.MarkCoursePublishedAsCompleted();
            return JsonSuccess();
        }

        [HttpPost]
        [Route("api/onboarding/close")]
        public ActionResult Close()
        {
            var onboarding = _onboardingRepository.GetByUserEmail(GetCurrentUsername());
            if (onboarding == null)
            {
                return JsonError(String.Empty);
            }

            onboarding.CloseOnboarding();
            return JsonSuccess();
        }
    }
}