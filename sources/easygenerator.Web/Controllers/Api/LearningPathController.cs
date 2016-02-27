using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildLearningPath;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Mappers;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using easygenerator.Web.Extensions;
using easygenerator.Web.Publish;
using easygenerator.Web.Publish.External;

namespace easygenerator.Web.Controllers.Api
{
    public class LearningPathController : DefaultApiController
    {
        private readonly ILearningPathRepository _repository;
        private readonly IEntityModelMapper<LearningPath> _mapper;
        private readonly IEntityFactory _entityFactory;
        private readonly ILearningPathBuilder _builder;
        private readonly IPublisher _entityPublisher;
        private readonly IUserRepository _userRepository;
        private readonly IDocumentRepository _documentRepository;
        private readonly IExternalPublisher _externalPublisher;
                         
        private readonly IUrlHelperWrapper _urlHelper;

        public LearningPathController(IUrlHelperWrapper urlHelper, ILearningPathRepository repository, IEntityModelMapper<LearningPath> mapper, IEntityFactory entityFactory, ILearningPathBuilder builder, IPublisher entityPublisher, IUserRepository userRepository, IDocumentRepository documentRepository, IExternalPublisher externalPublisher)
        {
            _urlHelper = urlHelper;
            _repository = repository;
            _mapper = mapper;
            _entityFactory = entityFactory;
            _builder = builder;
            _entityPublisher = entityPublisher;
            _userRepository = userRepository;
            _documentRepository = documentRepository;
            _externalPublisher = externalPublisher;
        }

        [HttpPost]
        [Route("api/learningpath/create")]
        public ActionResult Create(string title)
        {
            var learningPath = _entityFactory.LearningPath(title, GetCurrentUsername());
            _repository.Add(learningPath);

            return JsonSuccess(_mapper.Map(learningPath));
        }

        [HttpPost]
        [Route("api/learningpaths")]
        public ActionResult GetCollection()
        {
            var username = GetCurrentUsername();
            var learningPaths = _repository.GetCollection(e => e.CreatedBy == username);
            var data = learningPaths.Select(e => _mapper.Map(e));

            return JsonSuccess(data);
        }

        [HttpPost]
        [Route("api/learningpath/title/update")]
        public ActionResult UpdateTitle(LearningPath learningPath, string title)
        {
            if (learningPath == null)
            {
                return JsonLocalizableError(Errors.LearningPathNotFoundError, Errors.LearningPathNotFoundResourceKey);
            }

            learningPath.UpdateTitle(title, GetCurrentUsername());

            return JsonSuccess();
        }

        [HttpPost]
        [Route("api/learningpath/course/add")]
        public ActionResult AddCourse(LearningPath learningPath, Course course, int? index)
        {
            if (learningPath == null)
            {
                return JsonLocalizableError(Errors.LearningPathNotFoundError, Errors.LearningPathNotFoundResourceKey);
            }

            if (course == null)
            {
                return JsonLocalizableError(Errors.CourseNotFoundError, Errors.CourseNotFoundResourceKey);
            }

            learningPath.AddEntity(course, index, GetCurrentUsername());

            return JsonSuccess();
        }

        [HttpPost]
        [Route("api/learningpath/document/add")]
        public ActionResult AddDocument(LearningPath learningPath, Document document, int? index)
        {
            if (learningPath == null)
            {
                return JsonLocalizableError(Errors.LearningPathNotFoundError, Errors.LearningPathNotFoundResourceKey);
            }

            if (document == null)
            {
                return JsonLocalizableError(Errors.DocumentNotFoundError, Errors.DocumentNotFoundResourceKey);
            }

            learningPath.AddEntity(document, index, GetCurrentUsername());

            return JsonSuccess();
        }

        [HttpPost]
        [Route("api/learningpath/course/remove")]
        public ActionResult RemoveCourse(LearningPath learningPath, Course course)
        {
            if (learningPath == null)
            {
                return JsonLocalizableError(Errors.LearningPathNotFoundError, Errors.LearningPathNotFoundResourceKey);
            }

            if (course == null)
            {
                return JsonLocalizableError(Errors.CourseNotFoundError, Errors.CourseNotFoundResourceKey);
            }

            learningPath.RemoveEntity(course, GetCurrentUsername());

            return JsonSuccess();
        }

        [HttpPost]
        [Route("api/learningpath/document/remove")]
        public ActionResult RemoveDocument(LearningPath learningPath, Document document)
        {
            if (learningPath == null)
            {
                return JsonLocalizableError(Errors.LearningPathNotFoundError, Errors.LearningPathNotFoundResourceKey);
            }

            if (document == null)
            {
                return JsonLocalizableError(Errors.DocumentNotFoundError, Errors.DocumentNotFoundResourceKey);
            }

            learningPath.RemoveEntity(document, GetCurrentUsername());

            return JsonSuccess();
        }

        [HttpPost]
        [Route("api/learningpath/entities/order/update")]
        public ActionResult UpdateEntitiesOrder(LearningPath learningPath, ICollection<ILearningPathEntity> entities)
        {
            if (learningPath == null)
            {
                return HttpNotFound(Errors.LearningPathNotFoundError);
            }

            learningPath.UpdateEntitiesOrder(entities, GetCurrentUsername());

            return JsonSuccess();
        }

        [HttpPost]
        [Route("api/learningpath/delete")]
        public ActionResult Delete(LearningPath learningPath)
        {
            if (learningPath == null)
            {
                return JsonSuccess();
            }

            var deletedDocumentIds = new List<string>();

            if (learningPath.Entities.OfType<Document>().Any())
            {
                foreach (var document in learningPath.Entities.OfType<Document>())
                {
                    deletedDocumentIds.Add(document.Id.ToNString());
                    _documentRepository.Remove(document);
                }
            }

            _repository.Remove(learningPath);

            return JsonSuccess(new { deletedDocumentIds} );
        }

        [HttpPost]
        [Route("api/learningpath/build")]
        public ActionResult Build(LearningPath learningPath)
        {
            if (learningPath == null)
            {
                return JsonLocalizableError(Errors.LearningPathNotFoundError, Errors.LearningPathNotFoundResourceKey);
            }

            var result = _builder.Build(learningPath);

            return result ? JsonSuccess(new { learningPath.PackageUrl }) :
                JsonLocalizableError(Errors.LearningPathBuildActionFailedError, Errors.LearningPathBuildActionFailedResourceKey);
        }

        [HttpPost]
        [Route("api/learningpath/publish")]
        public ActionResult Publish(LearningPath learningPath)
        {
            if (learningPath == null)
            {
                return JsonLocalizableError(Errors.LearningPathNotFoundError, Errors.LearningPathNotFoundResourceKey);
            }

            var result = _entityPublisher.Publish(learningPath);

            return result ? JsonSuccess(new { PublicationUrl = _urlHelper.AddCurrentSchemeToUrl(learningPath.PublicationUrl) })
                : JsonLocalizableError(Errors.LearningPathPublishActionFailedError, Errors.LearningPathPublishActionFailedResourceKey);
        }

        [HttpPost]
        [Route("api/learningpath/PublishToCustomLms")]
        public ActionResult PublishToCustomLms(LearningPath learningPath, Company company)
        {
            if (learningPath == null)
            {
                return JsonLocalizableError(Errors.LearningPathNotFoundError, Errors.LearningPathNotFoundResourceKey);
            }

            var user = _userRepository.GetUserByEmail(GetCurrentUsername());
            if (user == null)
            {
                return JsonLocalizableError(Errors.UserDoesntExist, Errors.UserDoesntExistResourceKey);
            }
            var userCompany = user.Companies.SingleOrDefault(e => e == company);

            if (userCompany == null)
            {
                return JsonLocalizableError(Errors.UserNotMemberOfCompany, Errors.UserNotMemberOfCompanyResourceKey);
            }

            var result = _externalPublisher.Publish(learningPath, userCompany, user.Email);

            return result ? JsonSuccess() : JsonLocalizableError(Errors.LearningPathPublishActionFailedError, Errors.LearningPathPublishActionFailedResourceKey);
        }
    }
}