using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class DocumentController : DefaultApiController
    {
        private readonly IEntityFactory _entityFactory;
        private readonly IDocumentRepository _documentRepository;
        private readonly IEntityMapper _entityMapper;

        public DocumentController(IDocumentRepository documentRepository, IEntityFactory entityFactory, IEntityMapper entityMapper, IUserRepository userRepository)
        {
            _documentRepository = documentRepository;
            _entityFactory = entityFactory;
            _entityMapper = entityMapper;
        }

        [HttpPost]
        [Route("api/document/create")]
        public ActionResult Create(string title, string embedCode, DocumentType documentType)
        {
            var entity = _entityFactory.Document(title, embedCode, documentType, GetCurrentUsername());

            _documentRepository.Add(entity);

            return JsonSuccess(_entityMapper.Map(entity));
        }

        [HttpPost]
        [Route("api/document/delete")]
        public ActionResult Delete(Document document)
        {
            if (document == null)
            {
                return JsonSuccess();
            }

            var deletedFromLearningPathIds = new List<string>();

            if (document.LearningPaths.Any())
            {
                foreach (var learningPath in document.LearningPaths)
                {
                    deletedFromLearningPathIds.Add(learningPath.Id.ToNString());
                    learningPath.RemoveEntity(document, GetCurrentUsername());
                }
            }

            _documentRepository.Remove(document);

            return JsonSuccess(new { deletedFromLearningPathIds });
        }

        [HttpPost]
        [Route("api/documents")]
        public ActionResult GetCollection()
        {
            var username = GetCurrentUsername();
            var documents = _documentRepository.GetCollection(e => e.CreatedBy == username);
            return JsonSuccess(documents.Select(d => _entityMapper.Map(d)));
        }

        [HttpPost]
        [Route("api/document/updateTitle")]
        public ActionResult UpdateTitle(Document document, string documentTitle)
        {
            if (document == null)
            {
                return JsonLocalizableError(Errors.DocumentNotFoundError, Errors.DocumentNotFoundResourceKey);
            }

            document.UpdateTitle(documentTitle, GetCurrentUsername());

            return JsonSuccess(new { document.ModifiedOn });
        }

        [HttpPost]
        [Route("api/document/updateEmbedCode")]
        public ActionResult UpdateEmbedCode(Document document, string documentEmbedCode)
        {
            if (document == null)
            {
                return JsonLocalizableError(Errors.DocumentNotFoundError, Errors.DocumentNotFoundResourceKey);
            }

            document.UpdateEmbedCode(documentEmbedCode, GetCurrentUsername());

            return JsonSuccess(new { document.ModifiedOn });
        }
    }
}