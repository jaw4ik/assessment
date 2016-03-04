using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse.Modules;
using easygenerator.Web.Extensions;
using System;

namespace easygenerator.Web.BuildCourse
{
    public abstract class CourseBuilderBase : ICourseBuilder
    {
        protected readonly PhysicalFileManager FileManager;
        protected readonly BuildPathProvider BuildPathProvider;
        private readonly BuildPackageCreator _buildPackageCreator;
        private readonly ICourseContentProvider _buildContentProvider;
        private readonly IPackageModulesProvider _packageModulesProvider;
        private readonly ILog _logger;

        protected CourseBuilderBase(PhysicalFileManager fileManager, BuildPathProvider buildPathProvider, BuildPackageCreator buildPackageCreator,
            ICourseContentProvider buildContentProvider, IPackageModulesProvider packageModulesProvider, ILog logger)
        {
            FileManager = fileManager;
            BuildPathProvider = buildPathProvider;
            _buildPackageCreator = buildPackageCreator;
            _buildContentProvider = buildContentProvider;
            _packageModulesProvider = packageModulesProvider;
            _logger = logger;
        }

        public virtual bool Build(Course course)
        {
            var courseId = course.Id.ToNString();
            var buildId = GenerateBuildId(courseId);
            var isBuildSuccessful = true;

            try
            {
                var buildDirectoryPath = BuildPathProvider.GetBuildDirectoryName(buildId);

                CreatePackageDirectory(buildDirectoryPath);

                var modulesList = _packageModulesProvider.GetModulesList(course);
                _buildContentProvider.AddBuildContentToPackageDirectory(buildDirectoryPath, course, modulesList);
                _buildContentProvider.AddSettingsFileToPackageDirectory(buildDirectoryPath, course.GetTemplateSettings(course.Template));
                
                OnAfterBuildContentAdded(course, buildId);

                CreatePackageFromDirectory(buildId);
                OnAfterBuildPackageCreated(course, buildId);
            }
            catch (Exception exception)
            {
                _logger.LogException(exception);
                isBuildSuccessful = false;
            }

            try
            {
                DeleteOutdatedPackages(buildId, courseId);
                DeleteTempPackageDirectory(buildId);
            }
            catch (Exception exception)
            {
                _logger.LogException(exception);
            }

            return isBuildSuccessful;
        }

        protected virtual void OnAfterBuildPackageCreated(Course course, string buildId)
        {
        }

        protected virtual void OnAfterBuildContentAdded(Course course, string buildId)
        {
        }

        private void CreatePackageDirectory(string buildDirectory)
        {
            FileManager.CreateDirectory(buildDirectory);
        }

        private void CreatePackageFromDirectory(string buildId)
        {
            _buildPackageCreator.CreatePackageFromFolder(BuildPathProvider.GetBuildDirectoryName(buildId),
                                                         BuildPathProvider.GetBuildPackageFileName(buildId));
        }

        private void DeleteOutdatedPackages(string buildId, string packageId)
        {
            var packagePath = BuildPathProvider.GetDownloadPath();
            FileManager.DeleteFilesInDirectory(packagePath, packageId + "*.zip", buildId + ".zip");
        }

        private void DeleteTempPackageDirectory(string buildId)
        {
            FileManager.DeleteDirectory(BuildPathProvider.GetBuildDirectoryName(buildId));
        }

        private string GenerateBuildId(string packageId)
        {
            var buildDate = String.Format(" {0:yyyyMMdd-HH-mm-ss}-UTC", DateTimeWrapper.Now());
            return packageId + buildDate;
        }
    }
}