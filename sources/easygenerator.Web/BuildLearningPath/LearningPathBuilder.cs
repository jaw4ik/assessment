using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.Extensions;
using System;

namespace easygenerator.Web.BuildLearningPath
{
    public class LearningPathBuilder : ILearningPathBuilder
    {
        private readonly LearningPathCourseBuilder _courseBuilder;
        private readonly ILog _logger;
        private readonly PhysicalFileManager _fileManager;
        private readonly BuildPathProvider _buildPathProvider;
        private readonly BuildPackageCreator _buildPackageCreator;
        private readonly StartPageGenerator _startPageGenerator;
        
        public LearningPathBuilder(LearningPathCourseBuilder courseBuilder, ILog logger, PhysicalFileManager fileManager,
            BuildPathProvider buildPathProvider, BuildPackageCreator buildPackageCreator, StartPageGenerator startPageGenerator)
        {
            _courseBuilder = courseBuilder;
            _logger = logger;
            _fileManager = fileManager;
            _buildPackageCreator = buildPackageCreator;
            _buildPathProvider = buildPathProvider;
            _startPageGenerator = startPageGenerator;
        }

        public BuildResult Build(LearningPath learningPath)
        {
            var buildResult = true;
            var packageUrl = String.Empty;
            var learningPathId = learningPath.Id.ToNString();
            var buildId = GenerateBuildId(learningPathId);

            try
            {
                var buildDirectoryPath = _buildPathProvider.GetBuildDirectoryName(buildId);

                CreatePackageDirectory(buildDirectoryPath);

                foreach (var course in learningPath.Courses)
                {
                    _courseBuilder.Build(course, buildId);
                }

                AddStartPage(buildDirectoryPath, learningPath);

                CreatePackageFromDirectory(buildId);
                packageUrl = buildId + ".zip";
            }
            catch (Exception exception)
            {
                _logger.LogException(exception);
                buildResult =false;
            }

            try
            {
                DeleteOutdatedPackages(learningPathId, packageUrl);
                DeleteTempPackageDirectory(buildId);
            }
            catch (Exception exception)
            {
                _logger.LogException(exception);
            }

            return new BuildResult(buildResult, packageUrl);
        }

        private void AddStartPage(string buildDirectoryPath, LearningPath learningPath)
        {
            var fileName = _buildPathProvider.GetStartupPage(buildDirectoryPath);
            var startPageContent = _startPageGenerator.Generate(learningPath);
            
            _fileManager.WriteToFile(fileName, startPageContent);
        }

        private void CreatePackageDirectory(string buildDirectory)
        {
            _fileManager.CreateDirectory(buildDirectory);
        }

        private void CreatePackageFromDirectory(string buildId)
        {
            _buildPackageCreator.CreatePackageFromFolder(_buildPathProvider.GetBuildDirectoryName(buildId),
                                                         _buildPathProvider.GetBuildPackageFileName(buildId));
        }

        private void DeleteOutdatedPackages(string packageId, string deleteException)
        {
            var packagePath = _buildPathProvider.GetDownloadPath();
            _fileManager.DeleteFilesInDirectory(packagePath, packageId + "*.zip", deleteException);
        }

        private void DeleteTempPackageDirectory(string buildId)
        {
            _fileManager.DeleteDirectory(_buildPathProvider.GetBuildDirectoryName(buildId));
        }

        private string GenerateBuildId(string packageId)
        {
            var buildDate = String.Format(" {0:yyyyMMdd-HH-mm-ss}-UTC", DateTimeWrapper.Now());
            return packageId + buildDate;
        }
    }
}