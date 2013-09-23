using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;

namespace easygenerator.Web.Controllers.Api
{
    public class QuestionController : DefaultController
    {
        [HttpPost]
        public ActionResult Create(Objective objective, string title)
        {
            if (objective == null)
            {
                return JsonSuccess(new { Id = Guid.NewGuid().ToString("N"), CreatedOn = DateTimeWrapper.Now() });
            }

            var question = objective.AddQuestion(title);

            return JsonSuccess(new { Id = question.Id.ToString("N"), CreatedOn = question.CreatedOn });
        }

        [HttpPost]
        public ActionResult Delete(Objective objective, string title)
        {


            return JsonSuccess(new { ModifiedOn = DateTime.Now });
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
