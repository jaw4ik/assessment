using System;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class ObjectiveController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;
        private readonly IObjectiveRepository _repository;
        private readonly IEntityMapper _entityMapper;
        private readonly IUrlHelperWrapper _urlHelper;


        public ObjectiveController(IObjectiveRepository repository, IEntityFactory entityFactory, IEntityMapper entityMapper, IUrlHelperWrapper urlHelper)
        {
            _repository = repository;
            _entityFactory = entityFactory;
            _entityMapper = entityMapper;
            _urlHelper = urlHelper;
        }

        [HttpPost]
        [Route("api/objectives")]
        public ActionResult GetCollection()
        {
            var objectives = _repository.GetAvailableObjectivesCollection(User.Identity.Name);
            
            return JsonSuccess(objectives.Select(e => _entityMapper.Map(e)));
        }

        [HttpPost]
        [Route("api/objective/create")]
        public ActionResult Create(string title)
        {
            var objective = _entityFactory.Objective(title, GetCurrentUsername());

            _repository.Add(objective);

            return JsonSuccess(new
            {
                Id = objective.Id.ToNString(),
                ImageUrl = String.IsNullOrEmpty(objective.ImageUrl)
                    ? _urlHelper.ToAbsoluteUrl(Constants.Objective.DefaultImageUrl)
                    : objective.ImageUrl,
                CreatedOn = objective.CreatedOn,
                CreatedBy = objective.CreatedBy
            });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Objective))]
        [Route("api/objective/updatetitle")]
        public ActionResult UpdateTitle(Objective objective, string title)
        {
            if (objective == null)
            {
                return JsonLocalizableError(Errors.ObjectiveNotFoundError, Errors.ObjectiveNotFoundResourceKey);
            }

            objective.UpdateTitle(title, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = objective.ModifiedOn });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Objective))]
        [Route("api/objective/updateimage")]
        public ActionResult UpdateImage(Objective objective, string imageUrl)
        {
            if (objective == null)
            {
                return JsonLocalizableError(Errors.ObjectiveNotFoundError, Errors.ObjectiveNotFoundResourceKey);
            }

            objective.UpdateImageUrl(imageUrl, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = objective.ModifiedOn });
        }

        [HttpPost]
        [EntityOwner(typeof(Objective))]
        [Route("api/objective/delete")]
        public ActionResult Delete(Objective objective)
        {
            if (objective != null)
            {
                if (objective.Courses.Any() || objective.Questions.Any())
                {
                    return JsonLocalizableError(Errors.ObjectiveCannotBeDeleted, Errors.ObjectiveCannotBeDeletedResourceKey);
                }
                _repository.Remove(objective);
            }

            return JsonSuccess();
        }

        [HttpPost]
        [EntityCollaborator(typeof(Objective))]
        [Route("api/objective/updatequestionsorder")]
        public ActionResult UpdateQuestionsOrder(Objective objective, ICollection<Question> questions)
        {
            if (objective == null)
            {
                return HttpNotFound(Errors.ObjectiveNotFoundError);
            }

            objective.UpdateQuestionsOrder(questions, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = objective.ModifiedOn });
        }
    }
}