﻿using easygenerator.DomainModel;
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
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Controllers.Api
{
    public class TextMatchingQuestionController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;
        private readonly IDomainEventPublisher _eventPublisher;

        public TextMatchingQuestionController(IEntityFactory entityFactory, IDomainEventPublisher eventPublisher)
        {
            _entityFactory = entityFactory;
            _eventPublisher = eventPublisher;
        }

        [HttpPost]
        [StarterAccess(ErrorMessageResourceKey = Errors.UpgradeAccountToCreateAdvancedQuestionTypes)]
        [Route("api/question/create/type/6")]
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
            var defaultAnswer1 = _entityFactory.TextMatchingAnswer(Constants.TextMatching.DefaultAnswerKeyText, Constants.TextMatching.DefaultAnswerValueText, GetCurrentUsername());
            var defaultAnswer2 = _entityFactory.TextMatchingAnswer(Constants.TextMatching.DefaultAnswerKeyText, Constants.TextMatching.DefaultAnswerValueText, GetCurrentUsername());
            
            question.AddAnswer(defaultAnswer1, GetCurrentUsername());
            question.AddAnswer(defaultAnswer2, GetCurrentUsername());
        }

        [Route("api/question/textmatching/answers")]
        public ActionResult GetAnswers(TextMatching question)
        {
            return JsonSuccess(new
            {
                answers = question.Answers.Select(a => new
                {
                    id = a.Id.ToNString(),
                    key = a.Key,
                    value = a.Value
                })
            });
        }

        [Route("api/question/textmatching/answer/create")]
        public ActionResult CreateAnswer(TextMatching question, string key, string value)
        {
            if (question == null || key == null || value == null)
            {
                return BadRequest();
            }

            var answer = _entityFactory.TextMatchingAnswer(key, value, GetCurrentUsername());
            question.AddAnswer(answer, GetCurrentUsername());
            _eventPublisher.Publish(new TextMatchingAnswerCreatedEvent(answer));

            return JsonSuccess(answer.Id.ToNString());
        }

        [Route("api/question/textmatching/answer/delete")]
        public ActionResult DeleteAnswer(TextMatching question, TextMatchingAnswer answer)
        {
            if (question == null || answer == null)
            {
                return BadRequest();
            }

            question.RemoveAnswer(answer, GetCurrentUsername());
            _eventPublisher.Publish(new TextMatchingAnswerDeletedEvent(question, answer));

            return JsonSuccess();
        }

        [Route("api/question/textmatching/answer/updateKey")]
        public ActionResult ChangeAnswerKey(TextMatchingAnswer answer, string key)
        {
            if (answer == null || key == null)
            {
                return BadRequest();
            }

            answer.ChangeKey(key, GetCurrentUsername());
            _eventPublisher.Publish(new TextMatchingAnswerKeyChangedEvent(answer));

            return JsonSuccess();
        }

        [Route("api/question/textmatching/answer/updateValue")]
        public ActionResult ChangeAnswerValue(TextMatchingAnswer answer, string value)
        {
            if (answer == null || value == null)
            {
                return BadRequest();
            }

            answer.ChangeValue(value, GetCurrentUsername());
            _eventPublisher.Publish(new TextMatchingAnswerValueChangedEvent(answer));

            return JsonSuccess();
        }
    }
}