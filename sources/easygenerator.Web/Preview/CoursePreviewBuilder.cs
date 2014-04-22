using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;

namespace easygenerator.Web.Preview
{
    public class CoursePreviewBuilder : ICoursePreviewBuilder
    {
        private static readonly object _locker = new object();
        private static readonly Dictionary<string, Task<bool>> _activeBuilds = new Dictionary<string, Task<bool>>();

        private readonly ILog _logger;
        private readonly PhysicalFileManager _fileManager;
        private readonly BuildPathProvider _pathProvider;
        private readonly BuildContentProvider _contentProvider;

        public CoursePreviewBuilder(ILog logger,
                                    PhysicalFileManager fileManager,
                                    BuildPathProvider pathProvider,
                                    BuildContentProvider contentProvider)
        {
            _logger = logger;
            _fileManager = fileManager;
            _pathProvider = pathProvider;
            _contentProvider = contentProvider;
        }

        public Task<bool> Build(Course course)
        {
            ThrowIfCourseIsInvalid(course);

            var buildId = course.Id.ToString();

            lock (_locker)
            {

                if (!_activeBuilds.ContainsKey(buildId))
                {
                    var task = Task<bool>.Factory.StartNew(() => DoBuild(buildId, course));
                    _activeBuilds.Add(buildId, task);
                }
            }

            return _activeBuilds[buildId];
        }

        private bool DoBuild(string buildId, Course course)
        {
            bool isBuildSuccessful = true;

            try
            {
                var coursePreviewDirectory = _pathProvider.GetPreviewFolderPath(course.Id.ToString());
                ClearPreviewDirectory(coursePreviewDirectory);
                AddCourseContent(coursePreviewDirectory, course);
            }
            catch (Exception e)
            {
                _logger.LogException(e);
                isBuildSuccessful = false;
            }
            finally
            {
                FinishBuildAction(buildId);
            }

            return isBuildSuccessful;
        }

        private void FinishBuildAction(string buildId)
        {
            lock (_locker)
            {
                _activeBuilds.Remove(buildId);
            }
        }

        private void ThrowIfCourseIsInvalid(Course course)
        {
            if (course == null)
            {
                throw new ArgumentNullException("course");
            }
        }

        private void ClearPreviewDirectory(string coursePreviewDirectory)
        {
            if (_fileManager.DirectoryExists(coursePreviewDirectory))
            {
                _fileManager.DeleteDirectory(coursePreviewDirectory);
            }

            _fileManager.CreateDirectory(coursePreviewDirectory);
        }

        private void AddCourseContent(string coursePreviewDirectory, Course course)
        {
            _contentProvider.AddBuildContentToPackageDirectory(coursePreviewDirectory, course, String.Empty);
        }
    }
}