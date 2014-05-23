using System.IO;
using System.Linq;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.Components;
using System.Web.Mvc;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class TemplateController : DefaultController
    {
        private readonly ITemplateRepository _repository;

        public TemplateController(ITemplateRepository repository)
        {
            _repository = repository;
        }

        [HttpPost]
        public ActionResult GetCollection()
        {
            var templates = _repository.GetCollection();

            var result = templates.Select(tmpl => new
            {
                Id = tmpl.Id.ToNString(),
                Name = tmpl.Name,
                Image = tmpl.Image,
                SettingsUrl = "/Templates/" + tmpl.Name + "/settings.html",
                Description = tmpl.Description,
                PreviewDemoUrl = tmpl.PreviewUrl,
                Order = tmpl.Order
            });

            return JsonSuccess(result);
        }
    }
}
