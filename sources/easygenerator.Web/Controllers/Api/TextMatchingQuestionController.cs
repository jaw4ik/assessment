using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.DomainModel.Events.QuestionEvents.TextMatchingEvents;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Controllers.Api
{
    public class TextMatchingQuestionController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;
        private readonly IEntityMapper _entityMapper;
        private readonly IDomainEventPublisher _eventPublisher;

        public TextMatchingQuestionController(IEntityFactory entityFactory, IDomainEventPublisher eventPublisher, IEntityMapper entityMapper)
        {
            _entityFactory = entityFactory;
            _eventPublisher = eventPublisher;
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

            var question = _entityFactory.TextMatchingQuestion(title, GetCurrentUsername());
            CreateFirstAnswers(question);

            objective.AddQuestion(question, GetCurrentUsername());
            _eventPublisher.Publish(new QuestionCreatedEvent(question));

            return JsonSuccess(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        private void CreateFirstAnswers(TextMatching question)
        {
            question.AddAnswer(GetDefaultAnswer(), GetCurrentUsername());
            question.AddAnswer(GetDefaultAnswer(), GetCurrentUsername());
        }

        private TextMatchingAnswer GetDefaultAnswer()
        {
            return _entityFactory.TextMatchingAnswer(Constants.TextMatching.DefaultAnswerKeyText,
                Constants.TextMatching.DefaultAnswerValueText, GetCurrentUsername());
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
            _eventPublisher.Publish(new TextMatchingAnswerCreatedEvent(answer));

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
            _eventPublisher.Publish(new TextMatchingAnswerDeletedEvent(question, answer));

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
            _eventPublisher.Publish(new TextMatchingAnswerKeyChangedEvent(textMatchingAnswer));

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
            _eventPublisher.Publish(new TextMatchingAnswerValueChangedEvent(textMatchingAnswer));

            return JsonSuccess();
        }
    }
}