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
                return JsonSuccess(new { Id = Guid.NewGuid().ToString("N"), CreatedOn = DateTimeWrapper.Now() });
            }

            var question = _entityFactory.Question(title);

            objective.AddQuestion(question);

            return JsonSuccess(new { Id = question.Id.ToString("N"), CreatedOn = question.CreatedOn });
        }

        [HttpPost]
        public ActionResult Delete(Objective objective, Question question)
        {
            if (objective == null)
            {
                return JsonSuccess(new { ModifiedOn = DateTimeWrapper.Now() });
            }

            objective.RemoveQuestion(question);

            return JsonSuccess(new { ModifiedOn = objective.ModifiedOn });
        }

        [HttpPost]
        public ActionResult UpdateTitle(Question question, string title)
        {
            if (question == null)
            {
                return JsonSuccess(new { ModifiedOn = DateTimeWrapper.Now() });
            }

            question.UpdateTitle(title);

            return JsonSuccess(new { ModifiedOn = question.ModifiedOn });
        }

    }
}
