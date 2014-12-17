using System.Linq;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
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
        private readonly ManifestFileManager _manifestFileManager;

        public TemplateController(ITemplateRepository repository, ManifestFileManager manifestFileManager)
        {
            _repository = repository;
            _manifestFileManager = manifestFileManager;
        }

        [HttpPost]
        [Route("api/templates")]
        public ActionResult GetCollection()
        {
            var templates = _repository.GetCollection();

            var result = templates.Select(tmpl => new
            {
                Id = tmpl.Id.ToNString(),
                Manifest = _manifestFileManager.ReadManifest(tmpl.Id,  tmpl.PreviewUrl),
                PreviewDemoUrl = tmpl.PreviewUrl,
                Order = tmpl.Order
            });

            return JsonSuccess(result);
        }
    }
}
