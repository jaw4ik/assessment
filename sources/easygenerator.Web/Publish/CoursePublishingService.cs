using System;
using easygenerator.DomainModel.Entities;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.Components;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Publish
{
    public class CoursePublishingService : ICoursePublishingService
    {
        private readonly BuildPathProvider _pathProvider;
        private readonly IUrlHelperWrapper _urlHelper;
        private readonly ICoursePublisher _coursePublisher;
        private const string PublishedPackageUrlPattern = "~/storage/{0}/";
        private const string PublishedReviewPackageUrlPattern = "~/review/{0}/";

        public CoursePublishingService(BuildPathProvider pathProvider, ICoursePublisher coursePublisher, IUrlHelperWrapper urlHelper)
        {
            _pathProvider = pathProvider;
            _coursePublisher = coursePublisher;
            _urlHelper = urlHelper;
        }

        public string GetPublishedResourcePhysicalPath(string resourceUrl)
        {
            return _pathProvider.GetPublishedResourcePath(resourceUrl.Replace("/", "\\"));
        }

        public string GetPublishedPackageUrl(string courseId)
        {
            return GetPackageUrl(courseId, PublishedPackageUrlPattern);
        }

        public string GetCourseReviewUrl(string courseId)
        {
            return GetPackageUrl(courseId, PublishedReviewPackageUrlPattern);
        }

        public bool Publish(Course course)
        {
            var isPublishSuccessful = _coursePublisher.Publish(course, _pathProvider.GetPublishFolderPath(course.Id.ToString()));
            if (isPublishSuccessful)
                course.UpdatePublishedOnDate();

            return isPublishSuccessful;
        }

        private string GetPackageUrl(string courseId, string urlPattern)
        {
            return _urlHelper.ToAbsoluteUrl(string.Format(urlPattern, courseId));
        }

    }
}