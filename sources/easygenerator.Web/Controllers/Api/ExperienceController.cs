using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience;
using easygenerator.Web.Components;

namespace easygenerator.Web.Controllers.Api
{
    public class ExperienceController : DefaultController
    {
        private readonly IExperienceBuilder _builder;
        private readonly IEntityFactory _entityFactory;
        private readonly IExperienceRepository _repository;

        public ExperienceController(IExperienceBuilder experienceBuilder, IExperienceRepository repository, IEntityFactory entityFactory)
        {
            _builder = experienceBuilder;
            _repository = repository;
            _entityFactory = entityFactory;
        }

        [HttpPost]
        public ActionResult Create(string title, Template template)
        {
            var experience = _entityFactory.Experience(title, template, GetCurrentUsername());

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
        public ActionResult Build(Experience experience)
        {
            if (experience == null)
                return JsonError("Experience not found");

            var result = _builder.Build(experience);

            if (!result)
            {
                return JsonError("Build failed");
            }
            else
            {
                return JsonSuccess(new
                {
                    PackageUrl = experience.PackageUrl,
                    BuildOn = experience.BuildOn
                });
            }
        }

        [HttpPost]
        public ActionResult GetCollection()
        {
            var experiences = _repository.GetCollection().Where(exp => exp.CreatedBy == User.Identity.Name);

            return JsonSuccess(experiences);
        }

        [HttpPost]
        public ActionResult UpdateTitle(Experience experience, string experienceTitle)
        {
            if (experience == null)
            {
                return JsonSuccess(new { ModifiedOn = DateTimeWrapper.Now() });
            }

            experience.UpdateTitle(experienceTitle, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = experience.ModifiedOn });
        }

        [HttpPost]
        public ActionResult UpdateTemplate(Experience experience, Template template)
        {
            if (experience == null)
            {
                return JsonSuccess(new { ModifiedOn = DateTimeWrapper.Now() });
            }

            experience.UpdateTemplate(template, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = experience.ModifiedOn });
        }

        [HttpPost]
        public ActionResult RelateObjectives(Experience experience, ICollection<Objective> objectives)
        {
            if (experience == null)
            {
                return JsonSuccess(new
                {
                    ModifiedOn = DateTimeWrapper.Now()
                });
            }

            if (objectives.Count == 0)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            foreach (Objective objective in objectives)
            {
                experience.RelateObjective(objective, GetCurrentUsername());
            }

            return JsonSuccess(new
            {
                ModifiedOn = experience.ModifiedOn
            });
        }

        [HttpPost]
        public ActionResult UnrelateObjectives(Experience experience, ICollection<Objective> objectives)
        {
            if (experience == null)
            {
                return JsonSuccess(new
                {
                    ModifiedOn = DateTimeWrapper.Now()
                });
            }

            if (objectives.Count == 0)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            foreach (Objective objective in objectives)
            {
                experience.UnrelateObjective(objective, GetCurrentUsername());
            }

            return JsonSuccess(new
            {
                ModifiedOn = experience.ModifiedOn
            });
        }
    }
}