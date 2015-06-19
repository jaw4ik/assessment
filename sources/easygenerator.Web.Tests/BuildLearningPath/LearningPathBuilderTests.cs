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
        private ILearningPathCourseBuilder _courseBuilder;
        private ILog _logger;
        private PhysicalFileManager _fileManager;
        private BuildPathProvider _buildPathProvider;
        private BuildPackageCreator _buildPackageCreator;
        private StartupPageGenerator _startPageGenerator;

        [TestInitialize]
        public void InitializeContext()
        {
            _courseBuilder = Substitute.For<ILearningPathCourseBuilder>();
            _logger = Substitute.For<ILog>();
            _fileManager = Substitute.For<PhysicalFileManager>();
            _buildPathProvider = Substitute.For<BuildPathProvider>(Substitute.For<HttpRuntimeWrapper>());
            _buildPackageCreator = Substitute.For<BuildPackageCreator>(Substitute.For<PhysicalFileManager>());
            _startPageGenerator = Substitute.For<StartupPageGenerator>();
            _learningPathBuilder = new LearningPathBuilder(_courseBuilder, _logger, _fileManager, _buildPathProvider, _buildPackageCreator, _startPageGenerator);

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
        public void Build_ShouldBuildCoursesInLearningPath()
        {
            //Arrange
            LearningPath learningPath = LearningPathObjectMother.Create();
            Course course = CourseObjectMother.Create();
            learningPath.AddCourse(course, null, "author");
            var buildId = GetBuildId(learningPath);

            //Act
            _learningPathBuilder.Build(learningPath);

            //Assert
            _courseBuilder.Received().Build(course, buildId);
        }

        [TestMethod]
        public void Build_ShouldAddStartupPage()
        {
            //Arrange
            LearningPath learningPath = LearningPathObjectMother.Create();
            string startPagePath = "startPagePath";
            string startPageContent = "startPageContent";
            _buildPathProvider.GetStartupPageFileName(Arg.Any<string>()).Returns(startPagePath);
            _startPageGenerator.Generate(learningPath).Returns(startPageContent);

            //Act
            _learningPathBuilder.Build(learningPath);

            //Assert
            _fileManager.Received().WriteToFile(startPagePath, startPageContent);
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
        public void Build_ShouldReturnSuccessResultWithPackageUrl()
        {
            //Arrange
            LearningPath learningPath = LearningPathObjectMother.Create();
            var packageName = GetBuildId(learningPath) + ".zip";

            //Act
            var result = _learningPathBuilder.Build(learningPath);

            //Assert
            result.Success.Should().Be(true);
            result.PackageUrl.Should().Be(packageName);
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
            result.Success.Should().Be(false);
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
            result.Success.Should().Be(true);
        }

        #endregion

        private string GetBuildId(LearningPath learningPath)
        {
            return learningPath.Title + String.Format(" {0:yyyyMMdd-HH-mm-ss}", DateTimeWrapper.Now());
        }
    }
}
