using System.Net;
using System.Web.Mvc;
using easygenerator.Web.BuildExperience;
using easygenerator.Web.BuildExperience.BuildModel;

namespace easygenerator.Web.Controllers
{
    public class ExperienceController : Controller
    {
        private IExperienceBuilder _builder;

        public ExperienceController(IExperienceBuilder experienceBuilder)
        {
            _builder = experienceBuilder;
        }

        [HttpPost]
        public ActionResult Build(ExperienceBuildModel model)
        {
            if(model == null)
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

            var buildingResult = _builder.Build(model);
            return Json(new BuildResult() { Success = buildingResult });
        }
    }
}
