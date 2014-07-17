using System.Linq;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.DomainModel.Events.QuestionEvents.DragAnsDropEvents;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Controllers.Api
{
    public class DragAndDropTextQuestionController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;
        private readonly IDomainEventPublisher _eventPublisher;

        public DragAndDropTextQuestionController(IEntityFactory entityFactory, IDomainEventPublisher eventPublisher)
        {
            _entityFactory = entityFactory;
            _eventPublisher = eventPublisher;
        }

        [HttpPost]
        [PlusAccess(ErrorMessageResourceKey = Errors.UpgradeAccountToCreateAdvancedQuestionTypes)]
        [Route("api/question/" + Question.QuestionTypes.DragAndDropText + "/create")]
        public ActionResult Create(Objective objective, string title)
        {
            if (objective == null)
            {
                return JsonLocalizableError(Errors.ObjectiveNotFoundError, Errors.ObjectiveNotFoundResourceKey);
            }

            var question = _entityFactory.DragAndDropTextQuestion(title, GetCurrentUsername());


            objective.AddQuestion(question, GetCurrentUsername());
            _eventPublisher.Publish(new QuestionCreatedEvent(question));

            return JsonSuccess(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        [Route("api/question/draganddrop")]
        public ActionResult GetQuestionContent(DragAndDropText question)
        {
            return JsonSuccess(new
            {
                background = question.Background,
                dropspots = question.Dropspots.Select(d => new
                {
                    id = d.Id.ToNString(),
                    text = d.Text,
                    x = d.X,
                    y = d.Y
                })
            });
        }

        [Route("api/question/draganddrop/dropspot/create")]
        public ActionResult CreateDropspot(DragAndDropText question, string text)
        {
            if (question == null || text == null)
            {
                return BadRequest();
            }

            var dropspot = _entityFactory.Dropspot(text, 0, 0, GetCurrentUsername());
            question.AddDropspot(dropspot, GetCurrentUsername());
            _eventPublisher.Publish(new DropspotCreatedEvent(dropspot));

            return JsonSuccess(dropspot.Id.ToNString());
        }

        [Route("api/question/draganddrop/dropspot/delete")]
        public ActionResult DeleteDropspot(DragAndDropText question, Dropspot dropspot)
        {
            if (question == null || dropspot == null)
            {
                return BadRequest();
            }

            question.RemoveDropspot(dropspot, GetCurrentUsername());
            _eventPublisher.Publish(new DropspotDeletedEvent(question, dropspot));

            return JsonSuccess();
        }

        [Route("api/question/draganddrop/dropspot/updateText")]
        public ActionResult ChangeDropspotText(Dropspot dropspot, string text)
        {
            if (dropspot == null || text == null)
            {
                return BadRequest();
            }

            dropspot.ChangeText(text, GetCurrentUsername());
            _eventPublisher.Publish(new DropspotTextChangedEvent(dropspot));

            return JsonSuccess();
        }

        [Route("api/question/draganddrop/dropspot/updatePosition")]
        public ActionResult ChangeDropspotPosition(Dropspot dropspot, int? x, int? y)
        {
            if (dropspot == null || !x.HasValue || !y.HasValue)
            {
                return BadRequest();
            }

            dropspot.ChangePosition(x.Value, y.Value, GetCurrentUsername());
            _eventPublisher.Publish(new DropspotPositionChangedEvent(dropspot));

            return JsonSuccess();
        }

        [Route("api/question/draganddrop/background/update")]
        public ActionResult ChangeBackground(DragAndDropText question, string background)
        {
            if (question == null || background == null)
            {
                return BadRequest();
            }

            question.ChangeBackground(background, GetCurrentUsername());
            _eventPublisher.Publish(new BackgroundChangedEvent(question, background));

            return JsonSuccess();
        }

    }
}