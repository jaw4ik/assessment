using System.Linq;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using System.Web.Mvc;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class AnswerController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;

        public AnswerController(IEntityFactory entityFactory)
        {
            _entityFactory = entityFactory;
        }

        [HttpPost]
        public ActionResult Create(Question question, string text, bool isCorrect)
        {
            if (question == null)
            {
                return JsonLocalizableError(Errors.QuestionNotFoundError, Errors.QuestionNotFoundResourceKey);
            }

            var answer = _entityFactory.Answer(text, isCorrect, GetCurrentUsername());

            question.AddAnswer(answer, GetCurrentUsername());

            return JsonSuccess(new { Id = answer.Id.ToNString(), CreatedOn = answer.CreatedOn });
        }

        [HttpPost]
        public ActionResult Delete(Question question, Answer answer)
        {
            if (question == null)
            {
                return JsonLocalizableError(Errors.QuestionNotFoundError, Errors.QuestionNotFoundResourceKey);
            }

            if (answer != null)
            {
                question.RemoveAnswer(answer, GetCurrentUsername());
            }

            return JsonSuccess(new { ModifiedOn = question.ModifiedOn });
        }

        [HttpPost]
        public ActionResult Update(Answer answer, string text, bool isCorrect)
        {
            if (answer == null)
            {
                return JsonLocalizableError(Errors.AnswerNotFoundError, Errors.AnswerNotFoundResourceKey);
            }

            answer.UpdateText(text, GetCurrentUsername());
            answer.UpdateCorrectness(isCorrect, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = answer.ModifiedOn });
        }

        [HttpPost]
        public ActionResult GetCollection(Question question)
        {
            if (question == null)
            {
                return JsonLocalizableError(Errors.QuestionNotFoundError, Errors.QuestionNotFoundResourceKey);
            }

            var answers = question.Answers.Select(a => new
            {
                Id = a.Id.ToNString(),
                Text = a.Text,
                IsCorrect = a.IsCorrect,
                CreatedOn = a.CreatedOn
            });

            return JsonSuccess(new { Answers = answers });
        }

    }
}