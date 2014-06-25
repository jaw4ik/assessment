using System.Linq;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.LearningContentEvents;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using System.Web.Mvc;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Extensions;
using easygenerator.Web.Components.ActionFilters.Permissions;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class LearningContentController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;
        private readonly IDomainEventPublisher _eventPublisher;

        public LearningContentController(IEntityFactory entityFactory, IDomainEventPublisher eventPublisher)
        {
            _entityFactory = entityFactory;
            _eventPublisher = eventPublisher;
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/learningContent/create")]
        public ActionResult Create(Question question, string text)
        {
            if (question == null)
            {
                return JsonLocalizableError(Errors.QuestionNotFoundError, Errors.QuestionNotFoundResourceKey);
            }

            var learningContent = _entityFactory.LearningContent(text, GetCurrentUsername());

            question.AddLearningContent(learningContent, GetCurrentUsername());
            _eventPublisher.Publish(new LearningContentCreatedEvent(learningContent));

            return JsonSuccess(new { Id = learningContent.Id.ToNString(), CreatedOn = learningContent.CreatedOn });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/learningContent/delete")]
        public ActionResult Delete(Question question, LearningContent learningContent)
        {
            if (question == null)
            {
                return JsonLocalizableError(Errors.QuestionNotFoundError, Errors.QuestionNotFoundResourceKey);
            }

            if (learningContent != null)
            {
                question.RemoveLearningContent(learningContent, GetCurrentUsername());
                _eventPublisher.Publish(new LearningContentDeletedEvent(question, learningContent));
            }
            
            return JsonSuccess(new { ModifiedOn = question.ModifiedOn });
        }

        [HttpPost]
        [EntityCollaborator(typeof(LearningContent))]
        [Route("api/learningContent/updateText")]
        public ActionResult UpdateText(LearningContent learningContent, string text)
        {
            if (learningContent == null)
            {
                return JsonLocalizableError(Errors.LearningContentNotFoundError, Errors.LearningContentNotFoundResourceKey);
            }

            learningContent.UpdateText(text, GetCurrentUsername());
            _eventPublisher.Publish(new LearningContentUpdatedEvent(learningContent));

            return JsonSuccess(new { ModifiedOn = learningContent.ModifiedOn });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/learningContents")]
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