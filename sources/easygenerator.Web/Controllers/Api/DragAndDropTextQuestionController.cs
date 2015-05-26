using System.Linq;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Controllers.Api
{
    public class DragAndDropTextQuestionController : DefaultApiController
    {
        private readonly IEntityFactory _entityFactory;

        public DragAndDropTextQuestionController(IEntityFactory entityFactory)
        {
            _entityFactory = entityFactory;
        }

        [HttpPost]
        [PlusAccess(ErrorMessageResourceKey = Errors.UpgradeAccountToCreateAdvancedQuestionTypes)]
        [Route("api/question/" + Question.QuestionTypes.DragAndDropText + "/create")]
        [EntityCollaborator(typeof(Objective))]
        public ActionResult Create(Objective objective, string title)
        {
            if (objective == null)
            {
                return JsonLocalizableError(Errors.ObjectiveNotFoundError, Errors.ObjectiveNotFoundResourceKey);
            }

            var question = _entityFactory.DragAndDropTextQuestion(title, GetCurrentUsername());


            objective.AddQuestion(question, GetCurrentUsername());

            return JsonSuccess(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        [Route("api/question/draganddrop")]
        [EntityCollaborator(typeof(Question))]
        public ActionResult GetQuestionContent(DragAndDropText question)
        {
            return JsonSuccess(new
            {
                background = question.Background,
                dropspots = question.Dropspots.Select(d => new { id = d.Id.ToNString(), text = d.Text, x = d.X, y = d.Y })
            });
        }

        [Route("api/question/draganddrop/dropspot/create")]
        [EntityCollaborator(typeof(Question))]
        public ActionResult CreateDropspot(DragAndDropText question, string text)
        {
            if (question == null || text == null)
            {
                return BadRequest();
            }

            var dropspot = _entityFactory.Dropspot(text, 0, 0, GetCurrentUsername());
            question.AddDropspot(dropspot, GetCurrentUsername());

            return JsonSuccess(dropspot.Id.ToNString());
        }

        [Route("api/question/draganddrop/dropspot/delete")]
        [EntityCollaborator(typeof(Question))]
        public ActionResult DeleteDropspot(DragAndDropText question, Dropspot dropspot)
        {
            if (question == null || dropspot == null)
            {
                return BadRequest();
            }

            question.RemoveDropspot(dropspot, GetCurrentUsername());

            return JsonSuccess();
        }

        [Route("api/question/draganddrop/dropspot/updateText")]
        [EntityCollaborator(typeof(Dropspot))]
        public ActionResult ChangeDropspotText(Dropspot dropspot, string text)
        {
            if (dropspot == null || text == null)
            {
                return BadRequest();
            }

            dropspot.ChangeText(text, GetCurrentUsername());

            return JsonSuccess();
        }

        [Route("api/question/draganddrop/dropspot/updatePosition")]
        [EntityCollaborator(typeof(Dropspot))]
        public ActionResult ChangeDropspotPosition(Dropspot dropspot, int? x, int? y)
        {
            if (dropspot == null || !x.HasValue || !y.HasValue)
            {
                return BadRequest();
            }

            dropspot.ChangePosition(x.Value, y.Value, GetCurrentUsername());

            return JsonSuccess();
        }

        [Route("api/question/draganddrop/background/update")]
        [EntityCollaborator(typeof(Question))]
        public ActionResult ChangeBackground(DragAndDropText question, string background)
        {
            if (question == null || background == null)
            {
                return BadRequest();
            }

            question.ChangeBackground(background, GetCurrentUsername());

            return JsonSuccess();
        }

    }
}