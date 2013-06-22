using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.ViewModels.Objective;

namespace easygenerator.Web.Controllers
{
    public class ObjectiveController : Controller
    {
        private readonly IObjectiveRepository _repository;

        public ObjectiveController(IObjectiveRepository repository)
        {
            _repository = repository;
        }

        public ActionResult Index()
        {
            var objectives = _repository.GetCollection();
            
            return View(objectives.ToList().ConvertAll(input => input.Title));
        }

        [HttpGet]
        public ActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Create(CreateObjectiveViewModel viewModel)
        {
            if (!ModelState.IsValid)
                return View("Create", viewModel);

            var objective = new Objective(viewModel.Title, "a.drebot@gmail.com");

            _repository.Add(objective);

            return RedirectToAction("Index");
        }
    }
}
