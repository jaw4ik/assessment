using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.DomainModel.Events.QuestionEvents.SingleSelectImageEvents;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using System.Linq;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers.Api
{
    public class SingleSelectImageController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;
        private readonly IDomainEventPublisher _eventPublisher;
        private readonly IEntityMapper _entityMapper;

        public SingleSelectImageController(IEntityFactory entityFactory, IDomainEventPublisher eventPublisher, IEntityMapper entityMapper)
        {
            _entityFactory = entityFactory;
            _eventPublisher = eventPublisher;
            _entityMapper = entityMapper;
        }

        [EntityCollaborator(typeof(Objective))]
        [Route("api/question/" + Question.QuestionTypes.SingleSelectImage + "/create")]
        [StarterAccess(ErrorMessageResourceKey = Errors.UpgradeAccountToCreateAdvancedQuestionTypes)]
        public ActionResult Create(Objective objective, string title)
        {
            if (objective == null)
            {
                return JsonLocalizableError(Errors.ObjectiveNotFoundError, Errors.ObjectiveNotFoundResourceKey);
            }

            var question = _entityFactory.SingleSelectImageQuestion(title, GetCurrentUsername());
            SetInitialiData(question);

            objective.AddQuestion(question, GetCurrentUsername());
            _eventPublisher.Publish(new QuestionCreatedEvent(question));

            return JsonSuccess(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/question/" + Question.QuestionTypes.SingleSelectImage)]
        public ActionResult GetQuestionContent(SingleSelectImage question)
        {
            if (question == null)
            {
                return BadRequest();
            }

            return JsonSuccess(new
            {
                correctAnswerId = question.CorrectAnswer == null ? null : question.CorrectAnswer.Id.ToNString(),
                answers = question.Answers.Select(answer => _entityMapper.Map(answer))
            });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/question/" + Question.QuestionTypes.SingleSelectImage + "/answer/create")]
        public ActionResult CreateAnswer(SingleSelectImage question, string imageUrl)
        {
            if (question == null || imageUrl == null)
            {
                return BadRequest();
            }

            var answer = _entityFactory.SingleSelectImageAnswer(imageUrl, GetCurrentUsername());
            question.AddAnswer(answer, GetCurrentUsername());
            _eventPublisher.Publish(new SingleSelectImageAnswerCreatedEvent(answer));

            return JsonSuccess(answer.Id.ToNString());
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/question/" + Question.QuestionTypes.SingleSelectImage + "/answer/delete")]
        public ActionResult DeleteAnswer(SingleSelectImage question, SingleSelectImageAnswer answer)
        {
            if (question == null || answer == null || question.Answers.Count() <= 2)
            {
                return BadRequest();
            }

            question.RemoveAnswer(answer, GetCurrentUsername());
            _eventPublisher.Publish(new SingleSelectImageAnswerDeletedEvent(answer, question));

            return JsonSuccess(new
            {
                correctAnswerId = question.CorrectAnswer == null ? null : question.CorrectAnswer.Id.ToNString()
            });
        }

        [HttpPost]
        [Route("api/question/" + Question.QuestionTypes.SingleSelectImage + "/answer/image/update")]
        public ActionResult UpdateAnswerImage(SingleSelectImageAnswer answer, string imageUrl)
        {
            if (answer == null || imageUrl == null)
            {
                return BadRequest();
            }

            answer.UpdateImage(imageUrl, GetCurrentUsername());
            _eventPublisher.Publish(new SingleSelectImageAnswerImageUpdatedEvent(answer));

            return JsonSuccess();
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/question/" + Question.QuestionTypes.SingleSelectImage + "/setCorrectAnswer")]
        public ActionResult SetCorrectAnswer(SingleSelectImage question, SingleSelectImageAnswer answer)
        {
            if (question == null || answer == null)
            {
                return BadRequest();
            }

            question.SetCorrectAnswer(answer, GetCurrentUsername());
            _eventPublisher.Publish(new SingleSelectImageCorrectAnswerChangedEvent(answer));

            return JsonSuccess();
        }

        private void SetInitialiData(SingleSelectImage question)
        {
            var answer = _entityFactory.SingleSelectImageAnswer(GetCurrentUsername(), DateTimeWrapper.Now());
            question.AddAnswer(answer, GetCurrentUsername());
            question.AddAnswer(_entityFactory.SingleSelectImageAnswer(GetCurrentUsername(), DateTimeWrapper.Now().AddSeconds(1)), GetCurrentUsername());
            question.SetCorrectAnswer(answer, GetCurrentUsername());
        }

    }
}