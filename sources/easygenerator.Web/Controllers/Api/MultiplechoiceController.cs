using System;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Controllers.Api
{
    public class MultiplechoiceController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;
        private readonly IDomainEventPublisher _eventPublisher;

        public MultiplechoiceController(IEntityFactory entityFactory, IDomainEventPublisher eventPublisher)
        {
            _entityFactory = entityFactory;
            _eventPublisher = eventPublisher;
        }

        [HttpPost]
        [EntityCollaborator(typeof(Objective))]
        [Route("api/question/create/type/3")]
        public ActionResult Create(Objective objective, string title)
        {
            if (objective == null)
            {
                return JsonLocalizableError(Errors.ObjectiveNotFoundError, Errors.ObjectiveNotFoundResourceKey);
            }

            var question = _entityFactory.MultiplechoiceQuestion(title, GetCurrentUsername());

            CreateFirstAnswers(question);

            objective.AddQuestion(question, GetCurrentUsername());
            _eventPublisher.Publish(new QuestionCreatedEvent(question));

            return JsonSuccess(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        private void CreateFirstAnswers(Multipleselect question)
        {
            var incorrectAnswer = _entityFactory.Answer(Constants.DefaultAnswerOptionText, false, Guid.Empty, GetCurrentUsername(), DateTimeWrapper.Now().AddSeconds(1));
            var correctAnswer = _entityFactory.Answer(Constants.DefaultAnswerOptionText, true, Guid.Empty, GetCurrentUsername(), DateTimeWrapper.Now());
            question.AddAnswer(correctAnswer, GetCurrentUsername());
            question.AddAnswer(incorrectAnswer, GetCurrentUsername());
        }
    }
}