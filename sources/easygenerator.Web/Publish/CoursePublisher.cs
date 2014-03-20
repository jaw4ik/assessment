using System;
using easygenerator.DomainModel.Entities;
using easygenerator.Web.BuildCourse;
using easygenerator.Infrastructure;

namespace easygenerator.Web.Publish
{
    public class CoursePublisher : ICoursePublisher
    {
        private readonly BuildPathProvider _pathProvider;
        private readonly PhysicalFileManager _fileManager;
        private readonly IPublishDispatcher _publishDispatcher;
        private readonly ILog _logger;

        public CoursePublisher(PhysicalFileManager fileManager, BuildPathProvider pathProvider, IPublishDispatcher publishDispatcher, ILog logger)
        {
            _pathProvider = pathProvider;
            _fileManager = fileManager;
            _publishDispatcher = publishDispatcher;
            _logger = logger;
        }

        public bool Publish(Course course, string destinationDirectory)
        {
            if (String.IsNullOrWhiteSpace(destinationDirectory))
                throw new ArgumentException("Destination directory path is not specified.");

            if (!course.BuildOn.HasValue || string.IsNullOrWhiteSpace(course.PackageUrl))
                throw new NotSupportedException("Publishing of non builded course is not supported.");

            string courseId = course.Id.ToString();

            try
            {
                // start publish, now maintenance page will be shown instead of published content
                _publishDispatcher.StartPublish(courseId);

                PublishPackage(courseId, course, destinationDirectory);

                return true;
            }
            catch (Exception exception)
            {
                _logger.LogException(exception);
                return false;
            }
            finally
            {
                // end publish, now published content will be shown
                _publishDispatcher.EndPublish(courseId);
            }
        }

        protected virtual void PublishPackage(string courseId, Course course, string destinationDirectoryPath)
        {
            string buildPackagePath = _pathProvider.GetBuildedPackagePath(course.PackageUrl);
            CopyPublishedPackage(buildPackagePath, destinationDirectoryPath);
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