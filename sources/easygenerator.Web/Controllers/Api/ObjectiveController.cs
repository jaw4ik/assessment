using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
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

            return JsonSuccess(objectives);
        }

        [HttpPost]
        public ActionResult Create(string title)
        {
            var objective = _entityFactory.Objective(title);

            _repository.Add(objective);

            return JsonSuccess(new
            {
                Id = objective.Id.ToString("N"),
                CreatedOn = objective.CreatedOn
            });
        }

    }
}