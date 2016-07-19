using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Import.Presentation;
using easygenerator.Web.Import.Presentation.Mappers;
using easygenerator.Web.Import.WinToWeb;
using easygenerator.Web.Import.WinToWeb.Mappers;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using easygenerator.Web.Components.DomainOperations.CourseOperations;

namespace easygenerator.Web.Controllers.Api
{
    public class CourseImportController : DefaultApiController
    {
        private readonly IEntityMapper _entityMapper;
        private readonly ICourseRepository _courseRepository;
        private readonly ConfigurationReader _configurationReader;
        private readonly IPresentationModelMapper _presentationModelMapper;
        private readonly IPresentationCourseImporter _presentationCourseImporter;
        private readonly IWinToWebModelMapper _winToWebModelMapper;
        private readonly IWinToWebCourseImporter _winToWebCourseImporter;
        private readonly IDomainEventPublisher _eventPublisher;
        private readonly ICourseDomainOperationExecutor _courseDomainOperationExecutor;

        public CourseImportController(IEntityMapper entityMapper, ICourseRepository courseRepository, ConfigurationReader configurationReader,
            IPresentationModelMapper presentationModelMapper, IPresentationCourseImporter presentationCourseImporter,
            IWinToWebModelMapper winToWebModelMapper, IWinToWebCourseImporter winToWebCourseImporter, IDomainEventPublisher eventPublisher,
            ICourseDomainOperationExecutor courseDomainOperationExecutor)
        {
            _entityMapper = entityMapper;
            _courseRepository = courseRepository;
            _configurationReader = configurationReader;
            _presentationModelMapper = presentationModelMapper;
            _presentationCourseImporter = presentationCourseImporter;
            _winToWebModelMapper = winToWebModelMapper;
            _winToWebCourseImporter = winToWebCourseImporter;
            _eventPublisher = eventPublisher;
            _courseDomainOperationExecutor = courseDomainOperationExecutor;
        }

        [HttpPost]
        [LimitCoursesAmount]
        [Route("api/course/import/presentation")]
        public ActionResult ImportFromPresentation(HttpPostedFileBase file)
        {
            if (file == null)
            {
                return BadRequest();
            }

            if (file.ContentLength > _configurationReader.CourseImportConfiguration.PresentationMaximumFileSize)
            {
                return new HttpStatusCodeResult(HttpStatusCode.RequestEntityTooLarge);
            }

            var model = _presentationModelMapper.Map(file.InputStream);
            if (model == null)
            {
                return BadRequest();
            }

            var course = _presentationCourseImporter.Import(model, file.FileName, GetCurrentUsername());
            _courseDomainOperationExecutor.CreateCourse(course);

            return JsonSuccess(new
            {
                course = _entityMapper.Map(course),
                sections = course.RelatedSections.Select(e => _entityMapper.Map(e))
            });
        }

        [HttpPost]
        [LimitCoursesAmount]
        [Route("api/course/import/wintoweb")]
        public ActionResult ImportFromWindowsVersion()
        {
            var model = _winToWebModelMapper.Map(Request.InputStream);

            if (model == null)
            {
                return BadRequest();
            }

            var course = _winToWebCourseImporter.Import(model, GetCurrentUsername());
            _courseDomainOperationExecutor.CreateCourse(course);

            return JsonSuccess(new
            {
                course = _entityMapper.Map(course),
                sections = course.RelatedSections.Select(e => _entityMapper.Map(e))
            });
        }
    }
}