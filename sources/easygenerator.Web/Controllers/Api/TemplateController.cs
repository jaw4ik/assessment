using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.Mappers;
using System.Linq;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class TemplateController : DefaultController
    {
        private readonly ITemplateRepository _templateRepository;
        private readonly IEntityMapper _entityMapper;

        public TemplateController(ITemplateRepository templateRepository, IEntityMapper entityMapper)
        {
            _templateRepository = templateRepository;
            _entityMapper = entityMapper;
        }

        [HttpPost]
        [Route("api/templates")]
        public ActionResult GetCollection()
        {
            var result = _templateRepository.GetCollection(GetCurrentUsername())
                .Select(template => _entityMapper.Map(template));

            return JsonSuccess(result);
        }
    }
}
