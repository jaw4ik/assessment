using System;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using easygenerator.Auth.Attributes.Mvc;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.BuildCourse.Modules;
using easygenerator.Web.BuildCourse.PublishSettings;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Components.ActionResults;
using easygenerator.Web.Storage;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace easygenerator.Web.Controllers
{
    [NoCache]
    [Scope("preview")]
    [PreviewAccess]
    public class PreviewController : Controller
    {
        private readonly PackageModelMapper _packageModelMapper;
        private readonly PublishSettingsProvider _publishSettingsProvider;
        private readonly PackageModulesProvider _packageModulesProvider;
        private readonly ITemplateStorage _templateStorage;

        public PreviewController(PackageModelMapper packageModelMapper,
                                 PublishSettingsProvider publishSettingsProvider,
                                 PackageModulesProvider packageModulesProvider,
                                 ITemplateStorage templateStorage)
        {
            _packageModelMapper = packageModelMapper;
            _publishSettingsProvider = publishSettingsProvider;
            _packageModulesProvider = packageModulesProvider;
            _templateStorage = templateStorage;
        }

        [Scope("preview")]
        [Route("preview/{courseId}/settings.js")]
        public ActionResult GetPreviewCourseSettings(Course course)
        {
            if (course == null)
            {
                return HttpNotFound();
            }

            return Content(course.GetTemplateSettings(course.Template), "application/json");
        }

        [Route("preview/{courseId}/publishSettings.js")]
        public ActionResult GetPreviewCoursePublishSettings(Course course)
        {
            if (course == null)
            {
                return HttpNotFound();
            }

            var modulesList = _packageModulesProvider.GetModulesList(course);
            return Content(_publishSettingsProvider.GetPublishSettings(modulesList));
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

        [Route("preview/{courseId}/includedModules/{*moduleFileName}")]
        public ActionResult GetPreviewIncludedModules(Course course, string moduleFileName)
        {
            if (course == null)
            {
                return HttpNotFound();
            }

            var modulesList = _packageModulesProvider.GetModulesList(course);
            if (modulesList == null || !modulesList.Any())
            {
                return HttpNotFound();
            }

            var moduleName = Path.GetFileNameWithoutExtension(moduleFileName);
            var module = modulesList.FirstOrDefault(i => i.Name == moduleName);
            if (module == null)
            {
                return HttpNotFound();
            }

            return File(module.GetFilePath(), MimeMapping.GetMimeMapping(module.GetFilePath()));
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

            if (!_templateStorage.FileExists(course.Template, resourcePath))
            {
                return HttpNotFound();
            }

            var filePath = _templateStorage.GetAbsoluteFilePath(course.Template, resourcePath);
            return File(filePath, MimeMapping.GetMimeMapping(filePath));
        }
    }
}