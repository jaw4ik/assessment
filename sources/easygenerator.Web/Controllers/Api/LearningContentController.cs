using System.Linq;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers.Api
{
    public class LearningContentController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;

        public LearningContentController(IEntityFactory entityFactory)
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

            var learningContent = _entityFactory.LearningContent(text, GetCurrentUsername());

            question.AddLearningContent(learningContent, GetCurrentUsername());

            return JsonSuccess(new { Id = learningContent.Id.ToString("N"), CreatedOn = learningContent.CreatedOn });
        }

        [HttpPost]
        public ActionResult Delete(Question question, LearningContent learningContent)
        {
            if (question == null)
            {
                return JsonLocalizableError(Constants.Errors.QuestionNotFoundError, Constants.Errors.QuestionNotFoundResourceKey);
            }

            if (learningContent == null)
            {
                return JsonLocalizableError(Constants.Errors.LearningContentNotFoundError, Constants.Errors.LearningContentNotFoundResourceKey);
            }

            question.RemoveLearningContent(learningContent, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = question.ModifiedOn });
        }

        [HttpPost]
        public ActionResult UpdateText(LearningContent learningContent, string text)
        {
            if (learningContent == null)
            {
                return JsonLocalizableError(Constants.Errors.LearningContentNotFoundError, Constants.Errors.LearningContentNotFoundResourceKey);
            }

            learningContent.UpdateText(text, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = learningContent.ModifiedOn });
        }

        [HttpPost]
        public ActionResult GetCollection(Question question)
        {
            if (question == null)
            {
                return JsonLocalizableError(Constants.Errors.QuestionNotFoundError, Constants.Errors.QuestionNotFoundResourceKey);
            }

            var learningContents = question.LearningContents.Select(lo => new
            {
                Id = lo.Id.ToString("N"),
                Text = lo.Text,
            });

            return JsonSuccess(new { LearningContents = learningContents });
        }
    }
}