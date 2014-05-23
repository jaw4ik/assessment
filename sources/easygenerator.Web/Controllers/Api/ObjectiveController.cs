using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
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


        public ObjectiveController(IObjectiveRepository repository, IEntityFactory entityFactory)
        {
            _repository = repository;
            _entityFactory = entityFactory;
        }

        [HttpPost]
        [Route("api/objectives")]
        public ActionResult GetCollection()
        {
            var objectives = _repository.GetCollection(obj => obj.IsPermittedTo(User.Identity.Name));

            var result = objectives.Select(obj => new
            {
                Id = obj.Id.ToNString(),
                Title = obj.Title,
                CreatedBy = obj.CreatedBy,
                CreatedOn = obj.CreatedOn,
                ModifiedOn = obj.ModifiedOn,
                Questions = obj.Questions.Select(q => new
                {
                    Id = q.Id.ToNString(),
                    Title = q.Title,
                    Content = q.Content,
                    CreatedOn = q.CreatedOn,
                    CreatedBy = q.CreatedBy,
                    ModifiedOn = q.ModifiedOn,
                    Type = q.Type
                })
            });

            return JsonSuccess(result);
        }

        [HttpPost]
        [Route("api/objectiveExists")]
        public ActionResult ObjectiveExists(Objective objective)
        {
            return JsonSuccess(objective != null);
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
                CreatedOn = objective.CreatedOn
            });
        }

        [HttpPost]
        [Route("api/objective/update")]
        public ActionResult Update(Objective objective, string title)
        {
            if (objective == null)
            {
                return JsonLocalizableError(Errors.ObjectiveNotFoundError, Errors.ObjectiveNotFoundResourceKey);
            }

            objective.UpdateTitle(title, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = objective.ModifiedOn });
        }

        [HttpPost]
        [Route("api/objective/delete")]
        public ActionResult Delete(Objective objective)
        {
            if (objective != null)
            {
                if (objective.Courses.Any() || objective.Questions.Any())
                {
                    return JsonLocalizableError(Errors.ObjectiveCannotBeDeleted,
                                                Errors.ObjectiveCannotBeDeletedResourceKey);
                }
                _repository.Remove(objective);
            }

            return JsonSuccess();
        }

        [HttpPost]
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