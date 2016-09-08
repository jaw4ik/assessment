using System.Web.Mvc;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Web.Components;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class SurveyQuestionController : DefaultApiController
    {
        public SurveyQuestionController() { }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/question/updateIsSurvey")]
        public ActionResult UpdateIsSurvay(SurveyQuestion question, bool isSurvey)
        {
            if (question == null)
            {
                return JsonLocalizableError(Errors.QuestionNotFoundError, Errors.QuestionNotFoundResourceKey);
            }
            question.UpdateIsSurvey(isSurvey, GetCurrentUsername());
            return JsonSuccess(new { ModifiedOn = question.ModifiedOn });
        }
    }
}