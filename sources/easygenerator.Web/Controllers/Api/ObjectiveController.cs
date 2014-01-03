using System.Linq;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Extensions;

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
        public ActionResult GetCollection()
        {
            var objectives = _repository.GetCollection(obj => obj.CreatedBy == User.Identity.Name);

            var result = objectives.Select(obj => new
            {
                Id = obj.Id.ToNString(),
                Title = obj.Title,
                CreatedOn = obj.CreatedOn,
                ModifiedOn = obj.ModifiedOn,
                Questions = obj.Questions.Select(q => new
                {
                    Id = q.Id.ToNString(),
                    Title = q.Title,
                    Content = q.Content,
                    CreatedOn = q.CreatedOn,
                    ModifiedOn = q.ModifiedOn,
                    LearningContents = q.LearningContents.Select(lo => new
                    {
                        Id = lo.Id.ToNString(),
                        Text = lo.Text,
                    })
                })
            });


            return JsonSuccess(result);
        }

        [HttpPost]
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
        public ActionResult Delete(Objective objective)
        {
            if (objective != null)
            {
                if (objective.Experiences.Any() || objective.Questions.Any())
                {
                    return JsonLocalizableError(Errors.ObjectiveCannotBeDeleted,
                                                Errors.ObjectiveCannotBeDeletedResourceKey);
                }
                _repository.Remove(objective);
            }

            return JsonSuccess();
        }
    }
}