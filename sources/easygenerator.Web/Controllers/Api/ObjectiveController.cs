using System.Linq;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;

namespace easygenerator.Web.Controllers.Api
{
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
            var objectives = _repository.GetCollection();
            
            var result = objectives.Select(obj => new
            {
                Id = obj.Id,
                Title = obj.Title,
                CreatedOn = obj.CreatedOn,
                ModifiedOn = obj.ModifiedOn,
                Questions = obj.Questions.Select(q => new
                {
                    Id = q.Id,
                    Title = q.Title,
                    CreatedOn = q.CreatedOn,
                    ModifiedOn = q.ModifiedOn,
                    Answers = q.Answers.Select(a => new
                    {
                        Id = a.Id,
                        Text = a.Text,
                        IsCorrect = a.IsCorrect
                    }),
                    LearningObjects = q.LearningObjects.Select(lo => new
                    {
                        Id = lo.Id,
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
                Id = objective.Id.ToString("N"),
                CreatedOn = objective.CreatedOn
            });
        }

        [HttpPost]
        public ActionResult Update(Objective objective, string title)
        {
            if (objective == null)
            {
                return JsonSuccess(new { ModifiedOn = DateTimeWrapper.Now() });
            }

            objective.UpdateTitle(title, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = objective.ModifiedOn });
        }

        [HttpPost]
        public ActionResult Delete(Objective objective)
        {
            _repository.Remove(objective);

            return JsonSuccess();
        }
    }
}