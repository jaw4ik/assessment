using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
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
    public class BranchTrackController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;

        public BranchTrackController(IEntityFactory entityFactory)
        {
            _entityFactory = entityFactory;
        }

        [HttpPost]
        [EntityCollaborator(typeof(Objective))]
        [PlusAccess(ErrorMessageResourceKey = Errors.UpgradeAccountToCreateAdvancedQuestionTypes)]
        [Route("api/question/" + Question.QuestionTypes.BranchTrack + "/create")]
        public ActionResult Create(Objective objective, string title)
        {
            if (objective == null)
            {
                return JsonLocalizableError(Errors.ObjectiveNotFoundError, Errors.ObjectiveNotFoundResourceKey);
            }

            var question = _entityFactory.BranchTrack(title, GetCurrentUsername());

            objective.AddQuestion(question, GetCurrentUsername());

            return JsonSuccess(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }
    }
}