using System.IO;
using System.Net;
using System.Text;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Import.Presentation;
using System;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace easygenerator.Web.Controllers.Api
{
    public class CourseImportController : DefaultController
    {
        private readonly IEntityMapper _entityMapper;
        private readonly IEntityFactory _entityFactory;
        private readonly ICourseRepository _courseRepository;
        private readonly ITemplateRepository _templateRepository;
        private readonly ConfigurationReader _configurationReader;
        private readonly PresentationMapper _mapper;

        public const string DefaultCourseTitle = "Untitled course";
        public const string DefaultObjectiveTitle = "Untitled objective";
        public const string DefaultContentTitle = "Untitled content";


        public CourseImportController(IEntityMapper entityMapper, IEntityFactory entityFactory, ICourseRepository courseRepository, ITemplateRepository templateRepository, ConfigurationReader configurationReader, PresentationMapper mapper)
        {
            _entityMapper = entityMapper;
            _entityFactory = entityFactory;
            _courseRepository = courseRepository;
            _templateRepository = templateRepository;
            _configurationReader = configurationReader;
            _mapper = mapper;
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

            var course = _entityFactory.Course(Path.GetFileNameWithoutExtension(file.FileName), _templateRepository.GetDefaultTemplate(), GetCurrentUsername());
            var objective = _entityFactory.Objective(DefaultObjectiveTitle, GetCurrentUsername());
            course.RelateObjective(objective, null, GetCurrentUsername());

            for (var i = 0; i < model.Slides.Count; i++)
            {
                var slide = model.Slides[i];

                var content = _entityFactory.InformationContent(String.Format("{0} {1}", DefaultContentTitle, i + 1), GetCurrentUsername());
                objective.AddQuestion(content, GetCurrentUsername());

                if (!slide.Shapes.Any())
                {
                    continue;
                }

                var sb = new StringBuilder();

                foreach (var item in slide.Shapes)
                {
                    sb.Append(item.Text);
                }

                var learningContent = _entityFactory.LearningContent(sb.ToString(), GetCurrentUsername());
                content.AddLearningContent(learningContent, GetCurrentUsername());
            }

            _courseRepository.Add(course);

            return JsonSuccess(new
            {
                course = _entityMapper.Map(course),
                objectives = course.RelatedObjectives.Select(e => _entityMapper.Map(e))
            });
        }


    }
}