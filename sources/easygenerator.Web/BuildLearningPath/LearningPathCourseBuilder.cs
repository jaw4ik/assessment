using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.BuildCourse.Modules;
using easygenerator.Web.Extensions;
using System;

namespace easygenerator.Web.BuildLearningPath
{
    public class LearningPathCourseBuilder
    {
        protected readonly PhysicalFileManager FileManager;
        protected readonly BuildPathProvider BuildPathProvider;
        private readonly BuildContentProvider _buildContentProvider;
        private readonly IPackageModulesProvider _packageModulesProvider;
        private readonly ILog _logger;

        public LearningPathCourseBuilder(PhysicalFileManager fileManager, BuildPathProvider buildPathProvider,
            BuildContentProvider buildContentProvider, PackageModulesProvider packageModulesProvider, ILog logger)
        {
            FileManager = fileManager;
            BuildPathProvider = buildPathProvider;
            _buildContentProvider = buildContentProvider;
            _packageModulesProvider = packageModulesProvider;
            _logger = logger;
        }


        public virtual bool Build(Course course, string buildId)
        {
            var courseId = course.Id.ToNString();
            var isBuildSuccessful = true;

            try
            {
                var buildDirectoryPath = BuildPathProvider.GetBuildDirectoryName(buildId, courseId);

                CreateBuildDirectory(buildDirectoryPath);

                var modulesList = _packageModulesProvider.GetModulesList(course);
                _buildContentProvider.AddBuildContentToPackageDirectory(buildDirectoryPath, course, modulesList);
            }
            catch (Exception exception)
            {
                _logger.LogException(exception);
                isBuildSuccessful = false;
            }

            return isBuildSuccessful;
        }

        private void CreateBuildDirectory(string buildDirectory)
        {
            FileManager.CreateDirectory(buildDirectory);
        }

    }
}