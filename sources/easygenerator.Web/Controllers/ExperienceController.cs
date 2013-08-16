using System.Net;
using System.Web.Mvc;
using easygenerator.Web.BuildExperience;
using easygenerator.Web.BuildExperience.BuildModel;

namespace easygenerator.Web.Controllers
{
    public class ExperienceController : Controller
    {
        private readonly IExperienceBuilder _builder;
        private readonly PackageModelMapper _packageModelMapper;

        public ExperienceController(IExperienceBuilder experienceBuilder, PackageModelMapper packageModelMapper)
        {
            _builder = experienceBuilder;
            _packageModelMapper = packageModelMapper;
        }

        [HttpPost]
        public ActionResult Build(ExperienceBuildModel model)
        {
            if (model == null || !ModelState.IsValid)
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

            var buildingResult = _builder.Build(_packageModelMapper.MapExperienceBuildModel(model));
            return Json(new BuildResult() { Success = buildingResult });
        }
    }
}
