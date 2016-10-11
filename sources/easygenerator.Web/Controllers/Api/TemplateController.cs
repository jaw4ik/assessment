using easygenerator.Auth.Attributes.Mvc;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using easygenerator.Web.Storage;
using System;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class TemplateController : DefaultController
    {
        private readonly ITemplateRepository _templateRepository;
        private readonly IEntityMapper _entityMapper;
        private readonly ITemplateStorage _templateStorage;

        public TemplateController(ITemplateRepository templateRepository, IEntityMapper entityMapper, ITemplateStorage templateStorage)
        {
            _templateRepository = templateRepository;
            _entityMapper = entityMapper;
            _templateStorage = templateStorage;
        }

        [HttpPost]
        [Scope("api")]
        [Route("api/templates")]
        public ActionResult GetCollection()
        {
            var result = _templateRepository.GetCollection(GetCurrentUsername())
                .Where(template => _templateStorage.TemplateDirectoryExist(template))
                .Select(template => _entityMapper.Map(template))
                .Where(template => template != null);

            return JsonSuccess(result);
        }

        [ResourceUrlProcessor]
        [Route("templates/{templateName}/{*resourceUrl}")]
        public ActionResult GetTemplateResource(string templateName, string resourceUrl)
        {
            var template = _templateRepository.GetByName(templateName, GetCurrentUsername());
            if (template == null)
            {
                return HttpNotFound();
            }

            var resourcePath = String.IsNullOrWhiteSpace(resourceUrl) ? "index.html" : resourceUrl.Replace("/", "\\");
            if (!_templateStorage.FileExists(template, resourcePath))
            {
                return HttpNotFound();
            }

            var filePath = _templateStorage.GetAbsoluteFilePath(template, resourcePath);
            return File(filePath, MimeMapping.GetMimeMapping(filePath));
        }

        [HttpPost]
        [CustomRequireHttps]
        [AllowAnonymous]
        [ExternalApiAuthorize("easygenerator")]
        [Route("api/templates/custom/info")]
        public ActionResult GetCustomTemplatesInfo()
        {
            var result = _templateRepository.GetCollection()
                .Where(template => template.IsCustom && _templateStorage.TemplateDirectoryExist(template))
                .Select(template => new
                {
                    template.Name,
                    Id = template.Id.ToNString()
                })
                .Where(template => template != null);

            return JsonDataResult(result);
        }
    }
}
