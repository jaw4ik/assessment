using System;
using System.Linq;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.ViewModels.Objective;

namespace easygenerator.Web.Controllers.Api
{
    public class ObjectiveController : DefaultController
    {
        private readonly IObjectiveRepository _repository;

        public ObjectiveController(IObjectiveRepository repository)
        {
            _repository = repository;
        }

        [HttpPost]
        public ActionResult Create(string title)
        {
            var objective = new Objective(title);

            _repository.Add(objective);

            return JsonSuccess(new
            {
                Id = objective.Id.ToString().Replace("-", ""),
                CreatedOn = objective.CreatedOn
            });
        }

        public ActionResult GetCollection(string title)
        {
            var objectives = _repository.GetCollection();
            
            return JsonSuccess(objectives);
        }
    }
}