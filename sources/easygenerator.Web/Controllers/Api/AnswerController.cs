using System;
using System.Linq;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.AnswerEvents;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class AnswerController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;
        private readonly IEntityMapper _entityMapper;
        private readonly IDomainEventPublisher _eventPublisher;

        public AnswerController(IEntityFactory entityFactory, IEntityMapper entityMapper, IDomainEventPublisher eventPublisher)
        {
            _entityFactory = entityFactory;
            _entityMapper = entityMapper;
            _eventPublisher = eventPublisher;
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

            var answer = _entityFactory.Answer(text, isCorrect, Guid.Empty, GetCurrentUsername());

            question.AddAnswer(answer, GetCurrentUsername());
            _eventPublisher.Publish(new AnswerCreatedEvent(answer));

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
                _eventPublisher.Publish(new AnswerDeletedEvent(question, answer));
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
            _eventPublisher.Publish(new AnswerTextUpdatedEvent(answer));

            answer.UpdateCorrectness(isCorrect, GetCurrentUsername());
            _eventPublisher.Publish(new MultipleselectAnswerCorrectnessUpdatedEvent(answer));

            return JsonSuccess(new { ModifiedOn = answer.ModifiedOn });
        }

        [HttpPost]
        [EntityCollaborator(typeof (Question))]
        [Route("api/answer/singleselect/changecorrectanswer")]
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
            _eventPublisher.Publish(new SingleSelectTextAnswerCorrectnessUpdateEvent(answer));

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
            _eventPublisher.Publish(new AnswerTextUpdatedEvent(answer));

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