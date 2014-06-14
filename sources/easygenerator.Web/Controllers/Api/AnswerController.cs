using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.AnswerEvents;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using System;
using System.Linq;
using System.Web.Mvc;

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
        [EntityPermissions(typeof(Question))]
        [Route("api/answer/create")]
        public ActionResult Create(Question question, string text, bool isCorrect)
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
        [EntityPermissions(typeof(Question))]
        [Route("api/answer/delete")]
        public ActionResult Delete(Question question, Answer answer)
        {
            if (question == null)
            {
                return JsonLocalizableError(Errors.QuestionNotFoundError, Errors.QuestionNotFoundResourceKey);
            }
            
            question.RemoveAnswer(answer, GetCurrentUsername());
            _eventPublisher.Publish(new AnswerDeletedEvent(question, answer));

            return JsonSuccess(new { ModifiedOn = question.ModifiedOn });
        }

        [HttpPost]
        [EntityPermissions(typeof(Answer))]
        [Route("api/answer/update")]
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
        [EntityPermissions(typeof(Answer))]
        [Route("api/answer/updatecorrectness")]
        public ActionResult UpdateCorrectness(Answer answer, bool isCorrect)
        {
            if (answer == null)
            {
                return HttpNotFound(Errors.AnswerNotFoundError);
            }

            answer.UpdateCorrectness(isCorrect, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = answer.ModifiedOn });
        }

        [HttpPost]
        [EntityPermissions(typeof(Question))]
        [Route("api/answers")]
        public ActionResult GetCollection(Question question)
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