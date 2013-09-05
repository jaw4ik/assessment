using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
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

        public ExperienceController(IExperienceBuilder experienceBuilder, PackageModelMapper packageModelMapper)
        {
            _builder = experienceBuilder;
            _packageModelMapper = packageModelMapper;
        }

        [HttpPost]
        public ActionResult Create()
        {
            return JsonSuccess(new
            {
                Id = Guid.NewGuid().ToString().Replace("-", ""),
                CreatedOn = DateTimeWrapper.Now()
            });
        }

        [HttpPost]
        public ActionResult Build(ExperienceBuildModel model)
        {
            if (model == null || !ModelState.IsValid)
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

            var buildingResult = _builder.Build(_packageModelMapper.MapExperienceBuildModel(model));
            return Json(buildingResult);
        }
    }
}