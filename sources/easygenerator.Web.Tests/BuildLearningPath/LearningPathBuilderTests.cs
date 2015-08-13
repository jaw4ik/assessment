using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.BuildLearningPath;
using easygenerator.Web.Components;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;

namespace easygenerator.Web.Tests.BuildLearningPath
{
    [TestClass]
    public class LearningPathBuilderTests
    {
        private LearningPathBuilder _learningPathBuilder;
        private ILog _logger;
        private PhysicalFileManager _fileManager;
        private BuildPathProvider _buildPathProvider;
        private BuildPackageCreator _buildPackageCreator;
        private ILearningPathContentProvider _contentProvider;

        [TestInitialize]
        public void InitializeContext()
        {
            _logger = Substitute.For<ILog>();
            _fileManager = Substitute.For<PhysicalFileManager>();
            _buildPathProvider = Substitute.For<BuildPathProvider>(Substitute.For<HttpRuntimeWrapper>());
            _buildPackageCreator = Substitute.For<BuildPackageCreator>(Substitute.For<PhysicalFileManager>());
            _contentProvider = Substitute.For<ILearningPathContentProvider>();
            _learningPathBuilder = new LearningPathBuilder(_logger, _fileManager, _buildPathProvider, _buildPackageCreator, _contentProvider);

            DateTimeWrapper.Now = () => new DateTime(2013, 10, 12);
        }

        #region Build

        [TestMethod]
        public void Build_ShouldCreateBuildDirectory()
        {
            //Arrange
            LearningPath learningPath = LearningPathObjectMother.Create();
            var buildId = GetBuildId(learningPath);
            var buildDirectory = "buildDirectoryPath";
            _buildPathProvider.GetBuildDirectoryName(buildId).Returns(buildDirectory);

            //Act
            _learningPathBuilder.Build(learningPath);

            //Assert
            _fileManager.Received().CreateDirectory(buildDirectory);
        }

        [TestMethod]
        public void Build_ShouldAddLearningPathContent()
        {
            //Arrange
            LearningPath learningPath = LearningPathObjectMother.Create();
            var buildId = GetBuildId(learningPath);
            var buildDirectory = "buildDirectoryPath";
            _buildPathProvider.GetBuildDirectoryName(buildId).Returns(buildDirectory);

            //Act
            _learningPathBuilder.Build(learningPath);

            //Assert
            _contentProvider.Received().AddContentToPackageDirectory(buildDirectory, learningPath);
        }

        [TestMethod]
        public void Build_ShouldCreatePackageFromBuildDirectory()
        {
            //Arrange
            LearningPath learningPath = LearningPathObjectMother.Create();
            var buildId = GetBuildId(learningPath);
            var buildDirectory = "buildDirectoryPath";
            var packageName = "packageName";
            _buildPathProvider.GetBuildDirectoryName(buildId).Returns(buildDirectory);
            _buildPathProvider.GetBuildPackageFileName(buildId).Returns(packageName);

            //Act
            _learningPathBuilder.Build(learningPath);

            //Assert
            _buildPackageCreator.Received().CreatePackageFromFolder(buildDirectory, packageName);
        }

        [TestMethod]
        public void Build_ShouldUpdateLearningPathPackageUrl()
        {
            //Arrange
            LearningPath learningPath = LearningPathObjectMother.Create();
            var packageName = GetBuildId(learningPath) + ".zip";
            //Act
            _learningPathBuilder.Build(learningPath);

            //Assert
            learningPath.PackageUrl.Should().Be(packageName);
        }

        [TestMethod]
        public void Build_ShouldDeleteOutdatedPackages()
        {
            //Arrange
            LearningPath learningPath = LearningPathObjectMother.Create();
            var buildId = GetBuildId(learningPath);
            var deletePattern = learningPath.Title + "*.zip";
            var currentPackageName = buildId + ".zip";
            var downloadPath = "downloadPath";
            _buildPathProvider.GetDownloadPath().Returns(downloadPath);

            //Act
            _learningPathBuilder.Build(learningPath);

            //Assert
            _fileManager.Received().DeleteFilesInDirectory(downloadPath, deletePattern, currentPackageName);
        }

        [TestMethod]
        public void Build_ShouldDeleteBuildDirectory()
        {
            //Arrange
            LearningPath learningPath = LearningPathObjectMother.Create();
            var buildId = GetBuildId(learningPath);
            var buildDirectory = "buildDirectoryPath";
            _buildPathProvider.GetBuildDirectoryName(buildId).Returns(buildDirectory);

            //Act
            _learningPathBuilder.Build(learningPath);

            //Assert
            _fileManager.Received().DeleteDirectory(buildDirectory);
        }

        [TestMethod]
        public void Build_ShouldReturnSuccessResult()
        {
            //Arrange
            LearningPath learningPath = LearningPathObjectMother.Create();

            //Act
            var result = _learningPathBuilder.Build(learningPath);

            //Assert
            result.Should().Be(true);
        }
        
        [TestMethod]
        public void Build_ShouldLogException_WhenExceptionRicedDuringBuild()
        {
            //Arrange
            LearningPath learningPath = LearningPathObjectMother.Create();
            var exception = new Exception("some message");
            _fileManager.When(e => e.CreateDirectory(Arg.Any<string>())).Do(e => { throw exception; });

            //Act
            _learningPathBuilder.Build(learningPath);

            //Assert
            _logger.Received().LogException(exception);
        }

        [TestMethod]
        public void Build_ShouldReturnFalseResult_WhenExceptionRicedDuringBuild()
        {
            //Arrange
            LearningPath learningPath = LearningPathObjectMother.Create();
            var exception = new Exception("some message");
            _fileManager.When(e => e.CreateDirectory(Arg.Any<string>())).Do(e => { throw exception; });

            //Act
            var result = _learningPathBuilder.Build(learningPath);

            //Assert
            result.Should().Be(false);
        }

        [TestMethod]
        public void Build_ShouldLogException_WhenExceptionRicedDuringDelete()
        {
            //Arrange
            LearningPath learningPath = LearningPathObjectMother.Create();
            var exception = new Exception("some message");
            _fileManager.When(e => e.DeleteDirectory(Arg.Any<string>())).Do(e => { throw exception; });

            //Act
            _learningPathBuilder.Build(learningPath);

            //Assert
            _logger.Received().LogException(exception);
        }

        [TestMethod]
        public void Build_ShouldReturnSuccessResult_WhenExceptionRicedDuringDelete()
        {
            //Arrange
            LearningPath learningPath = LearningPathObjectMother.Create();
            var exception = new Exception("some message");
            _fileManager.When(e => e.DeleteDirectory(Arg.Any<string>())).Do(e => { throw exception; });

            //Act
            var result = _learningPathBuilder.Build(learningPath);

            //Assert
            result.Should().Be(true);
        }

        #endregion

        private string GetBuildId(LearningPath learningPath)
        {
            return learningPath.Title + String.Format(" {0:yyyyMMdd-HH-mm-ss}", DateTimeWrapper.Now());
        }
    }
}
