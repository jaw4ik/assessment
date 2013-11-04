﻿using System.Linq;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers.Api
{
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
                return JsonLocalizableError(Constants.Errors.QuestionNotFoundError, Constants.Errors.QuestionNotFoundResourceKey);
            }

            var answer = _entityFactory.Answer(text, isCorrect, GetCurrentUsername());

            question.AddAnswer(answer, GetCurrentUsername());

            return JsonSuccess(new { Id = answer.Id.ToString("N"), CreatedOn = answer.CreatedOn });
        }

        [HttpPost]
        public ActionResult Delete(Question question, Answer answer)
        {
            if (question == null)
            {
                return JsonLocalizableError(Constants.Errors.QuestionNotFoundError, Constants.Errors.QuestionNotFoundResourceKey);
            }

            if (answer != null)
            {
                question.RemoveAnswer(answer, GetCurrentUsername());
            }

            return JsonSuccess(new { ModifiedOn = question.ModifiedOn });
        }

        [HttpPost]
        public ActionResult UpdateText(Answer answer, string text)
        {
            if (answer == null)
            {
                return JsonLocalizableError(Constants.Errors.AnswerNotFoundError, Constants.Errors.AnswerNotFoundResourceKey);
            }

            answer.UpdateText(text, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = answer.ModifiedOn });
        }

        [HttpPost]
        public ActionResult UpdateCorrectness(Answer answer, bool isCorrect)
        {
            if (answer == null)
            {
                return JsonLocalizableError(Constants.Errors.AnswerNotFoundError, Constants.Errors.AnswerNotFoundResourceKey);
            }

            answer.UpdateCorrectness(isCorrect, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = answer.ModifiedOn });
        }

        [HttpPost]
        public ActionResult GetCollection(Question question)
        {
            if (question == null)
            {
                return JsonLocalizableError(Constants.Errors.QuestionNotFoundError, Constants.Errors.QuestionNotFoundResourceKey);
            }

            var answers = question.Answers.Select(a => new
            {
                Id = a.Id.ToString("N"),
                Text = a.Text,
                IsCorrect = a.IsCorrect
            });

            return JsonSuccess(new { Answers = answers });
        }

    }
}