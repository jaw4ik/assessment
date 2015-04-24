using System;
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
    public class HotSpotQuestionController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;

        public HotSpotQuestionController(IEntityFactory entityFactory)
        {
            _entityFactory = entityFactory;
        }

        [HttpPost]
        [PlusAccess(ErrorMessageResourceKey = Errors.UpgradeAccountToCreateAdvancedQuestionTypes)]
        [Route("api/question/" + Question.QuestionTypes.HotSpot + "/create")]
        [EntityCollaborator(typeof(Objective))]
        public ActionResult Create(Objective objective, string title)
        {
            if (objective == null)
            {
                return JsonLocalizableError(Errors.ObjectiveNotFoundError, Errors.ObjectiveNotFoundResourceKey);
            }

            var question = _entityFactory.HotSpot(title, GetCurrentUsername());


            objective.AddQuestion(question, GetCurrentUsername());

            return JsonSuccess(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        [Route("api/question/hotspot")]
        [EntityCollaborator(typeof(Question))]
        public ActionResult GetQuestionContent(HotSpot question)
        {
            return JsonSuccess(new
            {
                isMultiple = question.IsMultiple,
                background = question.Background,
                polygons = question.HotSpotPolygons.Select(d => new { id = d.Id.ToNString(), points = d.Points })
            });
        }

        [Route("api/question/hotspot/polygon/create")]
        [EntityCollaborator(typeof(Question))]
        public ActionResult CreateHotSpotPolygon(HotSpot question, string points)
        {
            if (question == null || points == null)
            {
                return BadRequest();
            }

            var polygon = _entityFactory.HotSpotPolygon(points, GetCurrentUsername());
            question.AddHotSpotPolygon(polygon, GetCurrentUsername());

            return JsonSuccess(polygon.Id.ToNString());
        }

        [Route("api/question/hotspot/polygon/update")]
        [EntityCollaborator(typeof(HotSpotPolygon))]
        public ActionResult UpdateHotSpotPolygonPoints(HotSpotPolygon hotspotPolygon, string points)
        {
            if (hotspotPolygon == null || String.IsNullOrEmpty(points))
            {
                return BadRequest();
            }

            hotspotPolygon.Update(points, GetCurrentUsername());

            return JsonSuccess();
        }

        [Route("api/question/hotspot/polygon/delete")]
        [EntityCollaborator(typeof(Question))]
        public ActionResult DeleteHotSpotPolygon(HotSpot question, HotSpotPolygon polygon)
        {
            if (question == null || polygon == null)
            {
                return BadRequest();
            }

            question.RemoveHotSpotPolygon(polygon, GetCurrentUsername());

            return JsonSuccess();
        }

        [Route("api/question/hotspot/background/update")]
        [EntityCollaborator(typeof(Question))]
        public ActionResult ChangeBackground(HotSpot question, string background)
        {
            if (question == null || background == null)
            {
                return BadRequest();
            }

            question.ChangeBackground(background, GetCurrentUsername());

            return JsonSuccess();
        }

        [HttpPost]
        [Route("api/question/hotspot/type")]
        [EntityCollaborator(typeof(Question))]
        public ActionResult ChangeType(HotSpot question, bool isMultiple)
        {
            if (question == null)
            {
                return BadRequest();
            }

            question.ChangeType(isMultiple, GetCurrentUsername());

            return JsonSuccess();
        }

    }
}