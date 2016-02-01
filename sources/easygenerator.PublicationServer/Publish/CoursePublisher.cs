using System;
using easygenerator.PublicationServer.FileSystem;
using easygenerator.PublicationServer.Logging;
using easygenerator.PublicationServer.Utils;

namespace easygenerator.PublicationServer.Publish
{
    public class CoursePublisher : ICoursePublisher
    {
        private readonly PhysicalFileManager _fileManager;
        private readonly IPublishDispatcher _publishDispatcher;
        private readonly PublicationPathProvider _publishPathProvider;
        private readonly ILog _logger;

        public CoursePublisher(PhysicalFileManager physicalFileManager, IPublishDispatcher publishDispatcher, PublicationPathProvider publishPathProvider, ILog logger)
        {
            _fileManager = physicalFileManager;
            _publishDispatcher = publishDispatcher;
            _logger = logger;
            _publishPathProvider = publishPathProvider;
        }

        public bool PublishCourse(Guid courseId)
        {
            try
            {
                _publishDispatcher.StartPublish(courseId);

                string uploadedPackageFilePath = _publishPathProvider.GetFilePathForUploadedPackage(courseId);
                string destinationFolderPath = _publishPathProvider.GetPublishedPackageFolderPath(courseId);

                try
                {
                    _fileManager.DeleteDirectory(destinationFolderPath);
                    _fileManager.ExtractArchiveToDirectory(uploadedPackageFilePath, destinationFolderPath);
                    _fileManager.DeleteFile(uploadedPackageFilePath);
                }
                catch
                {
                    _fileManager.DeleteDirectory(destinationFolderPath);
                    _fileManager.DeleteFile(uploadedPackageFilePath);
                    throw;
                }
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
    }
}
