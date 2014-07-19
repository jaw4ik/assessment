﻿using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents;
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
    [PlusAccess(ErrorMessageResourceKey = Errors.UpgradeAccountToCreateAdvancedQuestionTypes)]
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
        public ActionResult Create(Objective objective, string title)
        {
            if (objective == null)
            {
                return JsonLocalizableError(Errors.ObjectiveNotFoundError, Errors.ObjectiveNotFoundResourceKey);
            }

            var question = _entityFactory.SingleSelectImageQuestion(title, GetCurrentUsername());

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

            return JsonSuccess(answer.Id.ToNString());
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/question/" + Question.QuestionTypes.SingleSelectImage + "/answer/delete")]
        public ActionResult DeleteAnswer(SingleSelectImage question, SingleSelectImageAnswer answer)
        {
            if (question == null || answer == null)
            {
                return BadRequest();
            }

            question.RemoveAnswer(answer, GetCurrentUsername());

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

            return JsonSuccess();
        }


    }
}