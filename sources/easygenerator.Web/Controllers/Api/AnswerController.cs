using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;

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
                return JsonSuccess(new { Id = Guid.NewGuid().ToString("N"), CreatedOn = DateTimeWrapper.Now() });
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
                return JsonSuccess(new { ModifiedOn = DateTimeWrapper.Now() });
            }

            question.RemoveAnswer(answer, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = question.ModifiedOn });
        }

        [HttpPost]
        public ActionResult UpdateText(Answer answer, string text)
        {
            if (answer == null)
            {
                return JsonSuccess(new { ModifiedOn = DateTimeWrapper.Now() });
            }

            answer.UpdateText(text, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = answer.ModifiedOn });
        }

        [HttpPost]
        public ActionResult UpdateCorrectness(Answer answer, bool isCorrect)
        {
            if (answer == null)
            {
                return JsonSuccess(new { ModifiedOn = DateTimeWrapper.Now() });
            }

            answer.UpdateCorrectness(isCorrect, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = answer.ModifiedOn });
        }
    }
}