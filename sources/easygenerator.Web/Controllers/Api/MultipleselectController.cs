using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Extensions;
using easygenerator.Web.Resources.Controllers;
using easygenerator.Web.ViewModels.Api;

namespace easygenerator.Web.Controllers.Api
{
    public class MultipleselectController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;

        public MultipleselectController(IEntityFactory entityFactory)
        {
            _entityFactory = entityFactory;
        }

        [HttpPost]
        [EntityCollaborator(typeof(Objective))]
        [Route("api/question/" + Question.QuestionTypes.MultipleSelect + "/create")]
        public ActionResult Create(Objective objective, string title)
        {
            if (objective == null)
            {
                return JsonLocalizableError(Errors.ObjectiveNotFoundError, Errors.ObjectiveNotFoundResourceKey);
            }

            var incorrectAnswer = _entityFactory.Answer(Resources.Controllers.Resources.DefaultAnswerOptionText, false, GetCurrentUsername(), DateTimeWrapper.Now().AddSeconds(1));
            var correctAnswer = _entityFactory.Answer(Resources.Controllers.Resources.DefaultAnswerOptionText, true, GetCurrentUsername(), DateTimeWrapper.Now());

            var question = _entityFactory.MultipleselectQuestion(title, GetCurrentUsername(), correctAnswer, incorrectAnswer);

            objective.AddQuestion(question, GetCurrentUsername());

            return JsonSuccess(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }
    }
}