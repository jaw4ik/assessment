using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Import.Presentation;
using easygenerator.Web.Import.Presentation.Mappers;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers.Api
{
    public class CourseImportController : DefaultController
    {
        private readonly IEntityMapper _entityMapper;
        private readonly ICourseRepository _courseRepository;
        private readonly ConfigurationReader _configurationReader;
        private readonly IPresentationModelMapper _mapper;
        private readonly IPresentationCourseImporter _importer;

        public CourseImportController(IEntityMapper entityMapper, ICourseRepository courseRepository, ConfigurationReader configurationReader, IPresentationModelMapper mapper, IPresentationCourseImporter importer)
        {
            _entityMapper = entityMapper;
            _courseRepository = courseRepository;
            _configurationReader = configurationReader;
            _mapper = mapper;
            _importer = importer;
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

            var model = _mapper.Map(file.InputStream);
            if (model == null)
            {
                return BadRequest();
            }

            var course = _importer.Import(model, file.FileName, GetCurrentUsername());
            _courseRepository.Add(course);

            return JsonSuccess(new
            {
                course = _entityMapper.Map(course),
                objectives = course.RelatedObjectives.Select(e => _entityMapper.Map(e))
            });
        }
    }
}