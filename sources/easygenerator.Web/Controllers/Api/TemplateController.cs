using System.Linq;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers.Api
{
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
                Id = tmpl.Id.ToString("N"),
                Name = tmpl.Name,
                Image = tmpl.Image,
                Description = tmpl.Name == "Freestyle learning" ? "Use this when you want a course style like setup." : "Use this when you want to create an assessment."
            });

            return JsonSuccess(result);
        }
    }
}
