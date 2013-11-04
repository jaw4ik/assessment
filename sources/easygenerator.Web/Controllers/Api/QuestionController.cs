using System;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;

namespace easygenerator.Web.Controllers.Api
{
    public class QuestionController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;

        public QuestionController(IEntityFactory entityFactory)
        {
            _entityFactory = entityFactory;
        }

        [HttpPost]
        public ActionResult Create(Objective objective, string title)
        {
            if (objective == null)
            {
                return JsonLocalizableError(Constants.Errors.ObjectiveNotFoundError, Constants.Errors.ObjectiveNotFoundResourceKey);
            }

            var question = _entityFactory.Question(title, GetCurrentUsername());

            objective.AddQuestion(question, GetCurrentUsername());
            return JsonSuccess(new { Id = question.Id.ToString("N"), CreatedOn = question.CreatedOn });
        }

        [HttpPost]
        public ActionResult Delete(Objective objective, Question question)
        {
            if (objective == null)
            {
                return JsonLocalizableError(Constants.Errors.ObjectiveNotFoundError, Constants.Errors.ObjectiveNotFoundResourceKey);
            }

            if (question != null)
            {
                objective.RemoveQuestion(question, GetCurrentUsername());
            }

            return JsonSuccess(new { ModifiedOn = objective.ModifiedOn });
        }

        [HttpPost]
        public ActionResult UpdateTitle(Question question, string title)
        {
            if (question == null)
            {
                return JsonLocalizableError(Constants.Errors.QuestionNotFoundError, Constants.Errors.QuestionNotFoundResourceKey);
            }

            question.UpdateTitle(title, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = question.ModifiedOn });
        }

    }
}
