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
    public class LearningObjectController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;

        public LearningObjectController(IEntityFactory entityFactory)
        {
            _entityFactory = entityFactory;
        }

        [HttpPost]
        public ActionResult Create(Question question, string text)
        {
            if (question == null)
            {
                return JsonSuccess(new { Id = Guid.NewGuid().ToString("N"), CreatedOn = DateTimeWrapper.Now() });
            }

            var learningObject = _entityFactory.LearningObject(text, GetCurrentUsername());

            question.AddLearningObject(learningObject, GetCurrentUsername());

            return JsonSuccess(new { Id = learningObject.Id.ToString("N"), CreatedOn = learningObject.CreatedOn });
        }

        [HttpPost]
        public ActionResult Delete(Question question, LearningObject learningObject)
        {
            if (question == null)
            {
                return JsonSuccess(new { ModifiedOn = DateTimeWrapper.Now() });
            }

            question.RemoveLearningObject(learningObject, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = question.ModifiedOn });
        }

        [HttpPost]
        public ActionResult UpdateText(LearningObject learningObject, string text)
        {
            if (learningObject == null)
            {
                return JsonSuccess(new { ModifiedOn = DateTimeWrapper.Now() });
            }

            learningObject.UpdateText(text, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = learningObject.ModifiedOn });
        }
    }
}