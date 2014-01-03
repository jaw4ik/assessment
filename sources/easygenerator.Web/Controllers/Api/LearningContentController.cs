using System.Linq;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using System.Web.Mvc;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
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
                return JsonLocalizableError(Errors.QuestionNotFoundError, Errors.QuestionNotFoundResourceKey);
            }

            var learningContent = _entityFactory.LearningContent(text, GetCurrentUsername());

            question.AddLearningContent(learningContent, GetCurrentUsername());

            return JsonSuccess(new { Id = learningContent.Id.ToNString(), CreatedOn = learningContent.CreatedOn });
        }

        [HttpPost]
        public ActionResult Delete(Question question, LearningContent learningContent)
        {
            if (question == null)
            {
                return JsonLocalizableError(Errors.QuestionNotFoundError, Errors.QuestionNotFoundResourceKey);
            }

            if (learningContent != null)
            {
                question.RemoveLearningContent(learningContent, GetCurrentUsername());
            }

            return JsonSuccess(new { ModifiedOn = question.ModifiedOn });
        }

        [HttpPost]
        public ActionResult UpdateText(LearningContent learningContent, string text)
        {
            if (learningContent == null)
            {
                return JsonLocalizableError(Errors.LearningContentNotFoundError, Errors.LearningContentNotFoundResourceKey);
            }

            learningContent.UpdateText(text, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = learningContent.ModifiedOn });
        }

        [HttpPost]
        public ActionResult GetCollection(Question question)
        {
            if (question == null)
            {
                return JsonLocalizableError(Errors.QuestionNotFoundError, Errors.QuestionNotFoundResourceKey);
            }

            var learningContents = question.LearningContents.Select(lo => new
            {
                Id = lo.Id.ToNString(),
                Text = lo.Text,
                CreatedOn = lo.CreatedOn
            });

            return JsonSuccess(new { LearningContents = learningContents });
        }
    }
}