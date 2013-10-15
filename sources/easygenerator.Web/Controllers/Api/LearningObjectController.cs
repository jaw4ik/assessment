using System.Linq;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using System.Web.Mvc;

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
                return JsonLocalizableError(Constants.Errors.QuestionNotFoundError, Constants.Errors.QuestionNotFoundResourceKey);
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
                return JsonLocalizableError(Constants.Errors.QuestionNotFoundError, Constants.Errors.QuestionNotFoundResourceKey);
            }

            question.RemoveLearningObject(learningObject, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = question.ModifiedOn });
        }

        [HttpPost]
        public ActionResult UpdateText(LearningObject learningObject, string text)
        {
            if (learningObject == null)
            {
                return JsonLocalizableError(Constants.Errors.LearningObjectNotFoundError, Constants.Errors.LearningObjectNotFoundResourceKey);
            }

            learningObject.UpdateText(text, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = learningObject.ModifiedOn });
        }

        [HttpPost]
        public ActionResult GetCollection(Question question)
        {
            if (question == null)
            {
                return JsonLocalizableError(Constants.Errors.QuestionNotFoundError, Constants.Errors.QuestionNotFoundResourceKey);
            }

            var learningObjects = question.LearningObjects.Select(lo => new
            {
                Id = lo.Id.ToString("N"),
                Text = lo.Text,
            });

            return JsonSuccess(new { LearningObjects = learningObjects });
        }
    }
}