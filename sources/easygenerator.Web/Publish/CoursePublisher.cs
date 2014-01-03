using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Web;
using easygenerator.DomainModel.Entities;
using easygenerator.Web.BuildCourse;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;

namespace easygenerator.Web.Publish
{
    public class CoursePublisher : ICoursePublisher
    {
        private readonly BuildPathProvider _pathProvider;
        private readonly PhysicalFileManager _fileManager;
        private readonly IPublishDispatcher _publishDispatcher;
        private readonly IUrlHelperWrapper _urlHelper;
        private const string PublishedPackageUrlPattern = "~/storage/{0}/";

        public CoursePublisher(PhysicalFileManager fileManager, BuildPathProvider pathProvider, IPublishDispatcher publishDispatcher, IUrlHelperWrapper urlHelper)
        {
            _pathProvider = pathProvider;
            _fileManager = fileManager;
            _publishDispatcher = publishDispatcher;
            _urlHelper = urlHelper;
        }

        public string GetPublishedResourcePhysicalPath(string resourceUrl)
        {
            return _pathProvider.GetPublishedResourcePath(resourceUrl.Replace("/", "\\"));
        }

        public string GetPublishedPackageUrl(string courseId)
        {
            return _urlHelper.ToAbsoluteUrl(string.Format(PublishedPackageUrlPattern, courseId));
        }

        public bool Publish(Course course)
        {
            if (!course.BuildOn.HasValue || string.IsNullOrWhiteSpace(course.PackageUrl))
                throw new NotSupportedException("Publishing of non builded course is not supported.");

            string courseId = course.Id.ToString();

            try
            {
                // start publish, now maintenance page will be shown instead of published content
                _publishDispatcher.StartPublish(courseId);

                PublishPackage(courseId, course);

                course.UpdatePublishedOnDate();

                return true;
            }
            catch (Exception exception)
            {
                ElmahLog.LogException(exception);
                return false;
            }
            finally
            {
                // end publish, now published content will be shown
                _publishDispatcher.EndPublish(courseId);
            }
        }

        protected virtual void PublishPackage(string courseId, Course course)
        {
            string buildPackagePath = _pathProvider.GetBuildedPackagePath(course.PackageUrl);
            string publishFolderPath = _pathProvider.GetPublishFolderPath(courseId);
            CopyPublishedPackage(buildPackagePath, publishFolderPath);
        }

        private void CopyPublishedPackage(string packagePath, string destinationFolderPath)
        {
            try
            {
                _fileManager.DeleteDirectory(destinationFolderPath);
                _fileManager.ExtractArchiveToDirectory(packagePath, destinationFolderPath);
            }
            catch
            {
                _fileManager.DeleteDirectory(destinationFolderPath);
                throw;
            }
        }
    }
}