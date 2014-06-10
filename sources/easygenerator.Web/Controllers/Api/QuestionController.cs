using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Extensions;
using easygenerator.Web.ViewModels.Api;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class QuestionController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;

        public QuestionController(IEntityFactory entityFactory)
        {
            _entityFactory = entityFactory;
        }

        [HttpPost]
        [EntityPermissions(typeof(Objective))]
        [Route("api/question/create/type/0")]
        public ActionResult CreateMultipleSelect(Objective objective, string title)
        {
            return Create(objective, title, QuestionType.MultipleSelect);
        }

        [HttpPost, StarterAccess(ErrorMessageResourceKey = Errors.UpgradeToStarterPlanToCreateOtherQuestionTypes)]
        [EntityPermissions(typeof(Objective))]
        [Route("api/question/create/type/1")]
        public ActionResult CreateFillInTheBlank(Objective objective, string title)
        {
            return Create(objective, title, QuestionType.FillInTheBlanks);
        }

        [HttpPost]
        [EntityPermissions(typeof(Objective))]
        [Route("api/question/create/type/2")]
        public ActionResult CreateDragAndDrop(Objective objective, string title)
        {
            return Create(objective, title, QuestionType.DragAndDrop);
        }

        private ActionResult Create(Objective objective, string title, QuestionType type)
        {
            if (objective == null)
            {
                return JsonLocalizableError(Errors.ObjectiveNotFoundError, Errors.ObjectiveNotFoundResourceKey);
            }

            var question = _entityFactory.Question(title, type, GetCurrentUsername());

            objective.AddQuestion(question, GetCurrentUsername());

            return JsonSuccess(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        [HttpPost]
        [EntityPermissions(typeof(Objective))]
        [Route("api/question/delete")]
        public ActionResult Delete(Objective objective, ICollection<Question> questions)
        {
            if (objective == null)
            {
                return JsonLocalizableError(Errors.ObjectiveNotFoundError, Errors.ObjectiveNotFoundResourceKey);
            }

            if (questions == null)
            {
                return BadRequest();
            }

            foreach (Question question in questions)
            {
                objective.RemoveQuestion(question, GetCurrentUsername());
            }

            return JsonSuccess(new { ModifiedOn = objective.ModifiedOn });
        }

        [HttpPost]
        [EntityPermissions(typeof(Question))]
        [Route("api/question/updateTitle")]
        public ActionResult UpdateTitle(Question question, string title)
        {
            if (question == null)
            {
                return JsonLocalizableError(Errors.QuestionNotFoundError, Errors.QuestionNotFoundResourceKey);
            }

            question.UpdateTitle(title, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = question.ModifiedOn });
        }

        [HttpPost]
        [EntityPermissions(typeof(Question))]
        [Route("api/question/updateContent")]
        public ActionResult UpdateContent(Question question, string content)
        {
            if (question == null)
            {
                return JsonLocalizableError(Errors.QuestionNotFoundError, Errors.QuestionNotFoundResourceKey);
            }

            question.UpdateContent(content, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = question.ModifiedOn });
        }

        [HttpPost]
        [EntityPermissions(typeof(Question))]
        [Route("api/question/updatefillintheblank")]
        public ActionResult UpdateFillInTheBlank(Question question, string fillInTheBlank, ICollection<AnswerViewModel> answersCollection)
        {
            if (question == null)
            {
                return HttpNotFound(Errors.QuestionNotFoundError);
            }
            
            var answers = new Collection<Answer>();

            if (answersCollection != null)
            {
                foreach (var answerViewModel in answersCollection)
                {
                    var answer = _entityFactory.Answer(answerViewModel.Text, answerViewModel.IsCorrect,
                                answerViewModel.GroupId, GetCurrentUsername());
                    answers.Add(answer);
                }
            }
            
            question.UpdateAnswers(answers, GetCurrentUsername());

            question.UpdateContent(fillInTheBlank, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = question.ModifiedOn });
        }

    }
}
