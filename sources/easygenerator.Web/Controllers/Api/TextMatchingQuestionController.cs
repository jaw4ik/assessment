using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using System.Linq;
using System.Web.Mvc;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using easygenerator.Web.Resources.Controllers;

namespace easygenerator.Web.Controllers.Api
{
    public class TextMatchingQuestionController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;
        private readonly IEntityMapper _entityMapper;

        public TextMatchingQuestionController(IEntityFactory entityFactory, IEntityMapper entityMapper)
        {
            _entityFactory = entityFactory;
            _entityMapper = entityMapper;
        }

        [HttpPost]
        [StarterAccess(ErrorMessageResourceKey = Errors.UpgradeAccountToCreateAdvancedQuestionTypes)]
        [Route("api/question/" + Question.QuestionTypes.TextMatching + "/create")]
        [EntityCollaborator(typeof(Objective))]
        public ActionResult Create(Objective objective, string title)
        {
            if (objective == null)
            {
                return JsonLocalizableError(Errors.ObjectiveNotFoundError, Errors.ObjectiveNotFoundResourceKey);
            }

            var defaultAnswer1 = GetDefaultAnswer();
            var defaultAnswer2 = _entityFactory.TextMatchingAnswer(Resources.Controllers.Resources.DefaultTextMatchingAnswerKeyText,
                Resources.Controllers.Resources.DefaultTextMatchingAnswerValueText, GetCurrentUsername(), DateTimeWrapper.Now().AddSeconds(1));

            var question = _entityFactory.TextMatchingQuestion(title, GetCurrentUsername(), defaultAnswer1, defaultAnswer2);

            objective.AddQuestion(question, GetCurrentUsername());

            return JsonSuccess(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        private TextMatchingAnswer GetDefaultAnswer()
        {
            return _entityFactory.TextMatchingAnswer(Resources.Controllers.Resources.DefaultTextMatchingAnswerKeyText, Resources.Controllers.Resources.DefaultTextMatchingAnswerValueText, GetCurrentUsername());
        }

        [Route("api/question/textmatching/answers")]
        [EntityCollaborator(typeof(Question))]
        public ActionResult GetAnswers(TextMatching question)
        {
            var textMatchingAnswers = question.Answers.Select(answer => _entityMapper.Map(answer));
            return JsonSuccess(new { answers = textMatchingAnswers });
        }

        [Route("api/question/textmatching/answer/create")]
        [EntityCollaborator(typeof(Question))]
        public ActionResult CreateAnswer(TextMatching question)
        {
            if (question == null)
            {
                return BadRequest();
            }

            var answer = GetDefaultAnswer();
            question.AddAnswer(answer, GetCurrentUsername());

            return JsonSuccess(_entityMapper.Map(answer));
        }

        [Route("api/question/textmatching/answer/delete")]
        [EntityCollaborator(typeof(Question))]
        public ActionResult DeleteAnswer(TextMatching question, TextMatchingAnswer answer)
        {
            if (question == null || answer == null || question.Answers.Count() <= 2)
            {
                return BadRequest();
            }

            question.RemoveAnswer(answer, GetCurrentUsername());

            return JsonSuccess();
        }

        [Route("api/question/textmatching/answer/updateKey")]
        [EntityCollaborator(typeof(TextMatchingAnswer))]
        public ActionResult ChangeAnswerKey(TextMatchingAnswer textMatchingAnswer, string key)
        {
            if (textMatchingAnswer == null || key == null)
            {
                return BadRequest();
            }

            textMatchingAnswer.ChangeKey(key, GetCurrentUsername());

            return JsonSuccess();
        }

        [Route("api/question/textmatching/answer/updateValue")]
        [EntityCollaborator(typeof(TextMatchingAnswer))]
        public ActionResult ChangeAnswerValue(TextMatchingAnswer textMatchingAnswer, string value)
        {
            if (textMatchingAnswer == null || value == null)
            {
                return BadRequest();
            }

            textMatchingAnswer.ChangeValue(value, GetCurrentUsername());

            return JsonSuccess();
        }
    }
}