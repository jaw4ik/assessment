using System;
using System.IO;
using System.Web;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionResults;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace easygenerator.Web.Controllers
{
    [NoCache]
    public class PreviewController : Controller
    {
        private readonly BuildPathProvider _buildPathProvider;
        private readonly PhysicalFileManager _physicalFileManager;
        private readonly PackageModelMapper _packageModelMapper;

        public PreviewController(BuildPathProvider buildPathProvider,
                                 PhysicalFileManager physicalFileManager,
                                 PackageModelMapper packageModelMapper)
        {
            _buildPathProvider = buildPathProvider;
            _physicalFileManager = physicalFileManager;
            _packageModelMapper = packageModelMapper;
        }


        [Route("preview/{courseId}/settings.js")]
        public ActionResult GetPreviewCourseSettings(Course course)
        {
            if (course == null)
            {
                return HttpNotFound();
            }

            return Content(course.GetTemplateSettings(course.Template), "application/json");
        }

        [Route("preview/{courseId}/content/content.html")]
        public ActionResult GetPreviewCourseContent(Course course)
        {
            if (course == null)
            {
                return HttpNotFound();
            }

            return Content(course.IntroductionContent);
        }

        [Route("preview/{courseId}/content/{objectiveId}/{questionId}/content.html")]
        public ActionResult GetPreviewQuestionContent(Question question)
        {
            if (question == null)
            {
                return HttpNotFound();
            }

            return Content(question.Content);
        }

        [Route("preview/{courseId}/content/{objectiveId}/{questionId}/{learningContentId}.html")]
        public ActionResult GetPreviewLearningContent(LearningContent learningContent)
        {
            if (learningContent == null)
            {
                return HttpNotFound();
            }

            return Content(learningContent.Text);
        }

        [Route("preview/{courseId}/content/{objectiveId}/{questionId}/correctFeedback.html")]
        public ActionResult GetPreviewCorrectFeedback(Question question)
        {
            if (question == null)
            {
                return HttpNotFound();
            }

            return Content(question.Feedback.CorrectText);
        }

        [Route("preview/{courseId}/content/{objectiveId}/{questionId}/incorrectFeedback.html")]
        public ActionResult GetPreviewIncorrectFeedback(Question question)
        {
            if (question == null)
            {
                return HttpNotFound();
            }

            return Content(question.Feedback.IncorrectText);
        }

        [Route("preview/{courseId}/content/data.js")]
        public ActionResult GetPreviewCourseData(Course course)
        {
            if (course == null)
            {
                return HttpNotFound();
            }

            return new JsonDataResult(
                _packageModelMapper.MapCourse(course),
                settings: new JsonSerializerSettings()
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                });
        }

        [ResourceUrlProcessor]
        [Route("preview/{courseId}/{*resourceUrl}")]
        public ActionResult GetPreviewResource(Course course, string resourceUrl)
        {
            if (course == null)
            {
                return HttpNotFound();
            }

            var resourcePath = String.IsNullOrWhiteSpace(resourceUrl) ? "index.html" : resourceUrl.Replace("/", "\\");
            var templateDirectory = _buildPathProvider.GetTemplateDirectoryName(course.Template.Name);
            var filePath = Path.Combine(templateDirectory, resourcePath);

            if (!_physicalFileManager.FileExists(filePath))
            {
                return HttpNotFound();
            }

            return File(filePath, MimeMapping.GetMimeMapping(filePath));
        }
    }
}