using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using System;
using System.Web;
using easygenerator.Web.Components.Configuration;
using HttpClient = easygenerator.Infrastructure.Http.HttpClient;

namespace easygenerator.Web.Publish
{
    public class CoursePublisher : ICoursePublisher
    {
        private readonly BuildPathProvider _pathProvider;
        private readonly PhysicalFileManager _fileManager;
        private readonly ILog _logger;
        private readonly HttpClient _httpClient;
        private readonly ConfigurationReader _configurationReader;

        public CoursePublisher(PhysicalFileManager fileManager, BuildPathProvider pathProvider, ILog logger, HttpClient httpClient, ConfigurationReader configurationReader)
        {
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
                course.UpdatePublicationUrl(publishedCourseUrl);
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
            return string.Format("{0}:{1}/api/publish?key={2}&courseid={3}", HttpContext.Current.Request.Url.Scheme, _configurationReader.PublicationConfiguration.ServiceUrl,
                _configurationReader.PublicationConfiguration.ApiKey, courseId);
        }
    }
}