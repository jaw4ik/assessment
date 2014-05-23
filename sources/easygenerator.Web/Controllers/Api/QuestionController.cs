using System.Collections.ObjectModel;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using System.Collections.Generic;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Extensions;
using easygenerator.Web.ViewModels.Api;
using WebGrease.Css.Extensions;

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
        [Route("api/question/create")]
        public ActionResult Create(Objective objective, string title, QuestionType type = QuestionType.MultipleChoice)
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
        [Route("api/question/updatefillintheblank")]
        public ActionResult UpdateFillInTheBlank(Question question, string fillInTheBlank, ICollection<AnswerViewModel> answersCollection)
        {
            if (question == null)
            {
                return HttpNotFound(Errors.QuestionNotFoundError);
            }
            
            var answers = new Collection<Answer>();

            foreach (var answerViewModel in answersCollection)
            {
                var answer = _entityFactory.Answer(answerViewModel.Text, answerViewModel.IsCorrect,
                            answerViewModel.GroupId, GetCurrentUsername());
                answers.Add(answer);
            }

            question.UpdateAnswers(answers, GetCurrentUsername());

            question.UpdateContent(fillInTheBlank, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = question.ModifiedOn });
        }

    }
}
