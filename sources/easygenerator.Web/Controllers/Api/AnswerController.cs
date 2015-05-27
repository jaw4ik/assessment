using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using System.Linq;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class AnswerController : DefaultApiController
    {
        private readonly IEntityFactory _entityFactory;
        private readonly IEntityMapper _entityMapper;

        public AnswerController(IEntityFactory entityFactory, IEntityMapper entityMapper)
        {
            _entityFactory = entityFactory;
            _entityMapper = entityMapper;
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/answer/create")]
        public ActionResult Create(Multipleselect question, string text, bool isCorrect)
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
        [EntityCollaborator(typeof(Question))]
        [Route("api/answer/delete")]
        public ActionResult Delete(Multipleselect question, Answer answer)
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
        [EntityCollaborator(typeof(Answer))]
        [Route("api/answer/update")]
        public ActionResult Update(Answer answer, string text, bool isCorrect)
        {
            if (answer == null)
            {
                return HttpNotFound(Errors.AnswerNotFoundError);
            }

            answer.UpdateText(text, GetCurrentUsername());
            answer.UpdateCorrectness(isCorrect, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = answer.ModifiedOn });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/answer/singleselecttext/changecorrectanswer")]
        public ActionResult SingleSelectTextChangeCorrectAnswer(SingleSelectText question, Answer answer)
        {
            if (question == null)
            {
                return HttpNotFound(Errors.QuestionNotFoundError);
            }

            if (answer == null)
            {
                return HttpNotFound(Errors.AnswerNotFoundError);
            }

            question.SetCorrectAnswer(answer, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = answer.ModifiedOn });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Answer))]
        [Route("api/answer/updatetext")]
        public ActionResult UpdateText(Answer answer, string text)
        {
            if (answer == null)
            {
                return HttpNotFound(Errors.AnswerNotFoundError);
            }

            answer.UpdateText(text, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = answer.ModifiedOn });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/answers")]
        public ActionResult GetCollection(Multipleselect question)
        {
            if (question == null)
            {
                return JsonLocalizableError(Errors.QuestionNotFoundError, Errors.QuestionNotFoundResourceKey);
            }

            var answers = question.Answers.Select(answer => _entityMapper.Map(answer));

            return JsonSuccess(new { Answers = answers });
        }

    }
}