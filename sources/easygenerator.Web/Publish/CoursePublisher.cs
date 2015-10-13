using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using System;
using System.Web;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;
using HttpClient = easygenerator.Infrastructure.Http.HttpClient;

namespace easygenerator.Web.Publish
{
    public class CoursePublisher : ICoursePublisher
    {
        private readonly IUrlHelperWrapper _urlHelper;
        private readonly BuildPathProvider _pathProvider;
        private readonly PhysicalFileManager _fileManager;
        private readonly ILog _logger;
        private readonly HttpClient _httpClient;
        private readonly ConfigurationReader _configurationReader;

        public CoursePublisher(IUrlHelperWrapper urlHelper, PhysicalFileManager fileManager, BuildPathProvider pathProvider, ILog logger, HttpClient httpClient, ConfigurationReader configurationReader)
        {
            _urlHelper = urlHelper;
            _pathProvider = pathProvider;
            _logger = logger;
            _httpClient = httpClient;
            _configurationReader = configurationReader;
            _fileManager = fileManager;
        }

        public bool Publish(Course course)
        {
            var courseId = course.Id.ToString();

            try
            {
                if (!course.BuildOn.HasValue || string.IsNullOrWhiteSpace(course.PackageUrl))
                    throw new NotSupportedException(string.Format("Publishing of non builded course is not supported. CourseId: {0}", courseId));

                string publishMethodPath = GetPublishMethodPath(courseId);

                // start publish, now maintenance page will be shown instead of published content
                var publishedCourseUrl = _httpClient.PostFile<string>(publishMethodPath, courseId, _fileManager.GetFileBytes(_pathProvider.GetBuildedPackagePath(course.PackageUrl)));
                course.UpdatePublicationUrl(_urlHelper.RemoveSchemeFromUrl(publishedCourseUrl));
                return !String.IsNullOrEmpty(publishedCourseUrl);
            }
            catch (Exception exception)
            {
                _logger.LogException(exception);
                course.UpdatePublicationUrl(null);
                return false;
            }
        }

        private string GetPublishMethodPath(string courseId)
        {
            return _urlHelper.AddCurrentSchemeToUrl(string.Format("{0}/api/publish?key={1}&courseid={2}", _configurationReader.PublicationConfiguration.ServiceUrl,
                _configurationReader.PublicationConfiguration.ApiKey, courseId));
        }
    }
}