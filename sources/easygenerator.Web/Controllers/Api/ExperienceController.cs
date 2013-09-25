﻿using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience;
using easygenerator.Web.BuildExperience.BuildModel;
using easygenerator.Web.Components;

namespace easygenerator.Web.Controllers.Api
{
    public class ExperienceController : DefaultController
    {
        private readonly IExperienceBuilder _builder;
        private readonly PackageModelMapper _packageModelMapper;
        private readonly IEntityFactory _entityFactory;
        private readonly IExperienceRepository _repository;

        public ExperienceController(IExperienceBuilder experienceBuilder, PackageModelMapper packageModelMapper, IExperienceRepository repository, IEntityFactory entityFactory)
        {
            _builder = experienceBuilder;
            _packageModelMapper = packageModelMapper;
            _repository = repository;
            _entityFactory = entityFactory;
        }

        [HttpPost]
        public ActionResult Create(string title)
        {
            var experience = _entityFactory.Experience(title);

            _repository.Add(experience);

            return JsonSuccess(new
            {
                Id = experience.Id.ToString("N"),
                CreatedOn = experience.CreatedOn
            });
        }

        [HttpPost]
        public ActionResult Delete(Experience experience)
        {
            _repository.Remove(experience);

            return JsonSuccess();
        }

        [HttpPost]
        public ActionResult Build(ExperienceBuildModel model)
        {
            if (model == null || !ModelState.IsValid)
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

            var buildingResult = _builder.Build(_packageModelMapper.MapExperienceBuildModel(model));
            return Json(buildingResult);
        }

        [HttpPost]
        public ActionResult GetCollection()
        {
            var experiences = _repository.GetCollection();

            return JsonSuccess(experiences);
        }

        [HttpPost]
        public ActionResult UpdateTitle(Experience experience, string experienceTitle)
        {

            return JsonSuccess(new
            {
                ModifiedOn = DateTimeWrapper.Now()
            });
        }

        [HttpPost]
        public ActionResult UpdateTemplate(Experience experience, Guid templateId)
        {

            return JsonSuccess(new
            {
                ModifiedOn = DateTimeWrapper.Now()
            });
        }

        [HttpPost]
        public ActionResult RelateObjectives(Experience experience, ICollection<Objective> objectives)
        {
            if (experience == null || objectives.Count == 0)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            foreach (Objective objective in objectives)
            {
                experience.RelateObjective(objective);
            }

            return JsonSuccess(new
            {
                ModifiedOn = experience.ModifiedOn
            });
        }

        public ActionResult UnrelateObjectives(Experience experience, ICollection<Objective> objectives)
        {
            if (experience == null || objectives.Count == 0)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            foreach (Objective objective in objectives)
            {
                experience.UnrelateObjective(objective);
            }

            return JsonSuccess(new
            {
                ModifiedOn = experience.ModifiedOn
            });
        }
    }
}