using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Extensions;
using System.Linq;
using System.Web.Mvc;

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
            var username = GetCurrentUsername();

            var result = _repository.GetCollection(t => !t.IsCustom || t.CreatedBy == username).Select(template => new
            {
                Id = template.Id.ToNString(),
                Manifest = _manifestFileManager.ReadManifest(template.Id, template.PreviewUrl),
                PreviewDemoUrl = template.PreviewUrl,
                Order = template.Order,
                IsCustom = template.IsCustom,
                IsNew = template.IsNew
            });

            return JsonSuccess(result);
        }
    }
}
