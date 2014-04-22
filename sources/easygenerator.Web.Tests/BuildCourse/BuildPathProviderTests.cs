﻿using System.IO;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.Components;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.BuildCourse
{
    [TestClass]
    public class BuildPathProviderTests
    {
        private const string BuildDirectory = "BuildDirectory";
        private const string ObjectiveId = "ObjectiveId";
        private const string QuestionId = "QuestionId";
        private const string LearningContentId = "LearningContentId";

        private HttpRuntimeWrapper _httpRuntimeWrapper;
        private BuildPathProvider _buildPathProvider;

        private string BuildPath { get; set; }
        private string WebsitePath { get; set; }
        private string TemplatesPath { get; set; }
        private string DownloadPath { get; set; }
        private string PublishPath { get; set; }
        private string PreviewPath { get; set; }

        [TestInitialize]
        public void InitializeContext()
        {
            _httpRuntimeWrapper = Substitute.For<HttpRuntimeWrapper>();
            _httpRuntimeWrapper.GetDomainAppPath().Returns("Some app path");

            _buildPathProvider = new BuildPathProvider(_httpRuntimeWrapper);

            BuildPath = Path.Combine(Path.GetTempPath(), "eg", "build");
            WebsitePath = _httpRuntimeWrapper.GetDomainAppPath();
            TemplatesPath = Path.Combine(WebsitePath, "Templates");
            DownloadPath = Path.Combine(WebsitePath, "Download");
            PublishPath = Path.Combine(WebsitePath, "PublishedPackages");
            PreviewPath = Path.Combine(WebsitePath, "PreviewPackages");
        }

        #region GetBuildDirectoryName

        [TestMethod]
        public void GetBuildDirectoryName_ShouldReturnBuildDirecory()
        {
            //Arrange
            var buildId = "BuildId";
            var expectedPath = Path.Combine(BuildPath, buildId);

            //Act
            var result = _buildPathProvider.GetBuildDirectoryName(buildId);

            //Assert
            result.Should().Be(expectedPath);
        }

        #endregion

        #region GetContentDirectoryName

        [TestMethod]
        public void GetContentDirectoryName_ShouldReturnContentDirectory()
        {
            //Arrange
            var expectedPath = "BuildDirectory\\content";

            //Act
            var result = _buildPathProvider.GetContentDirectoryName(BuildDirectory);

            //Assert
            result.Should().Be(expectedPath);
        }

        #endregion

        #region GetCourseIntroductionContentFileName

        [TestMethod]
        public void GetCourseIntroductionContentFileName_ShouldReturnCourseContentFileName()
        {
            //Arrange
            var expectedPath = "BuildDirectory\\content\\content.html";

            //Act
            var result = _buildPathProvider.GetCourseIntroductionContentFileName(BuildDirectory);

            //Assert
            result.Should().Be(expectedPath);
        }

        #endregion GetCourseIntroductionContentFileName

        #region GetObjectiveDirectoryName

        [TestMethod]
        public void GetObjectiveDirectoryName_ShouldReturnObjectiveDirecory()
        {
            //Arrange
            var expectedPath = "BuildDirectory\\content\\ObjectiveId";

            //Act
            var result = _buildPathProvider.GetObjectiveDirectoryName(BuildDirectory, ObjectiveId);

            //Assert
            result.Should().Be(expectedPath);
        }

        #endregion

        #region GetQuestionDirectoryName

        [TestMethod]
        public void GetQuestionDirectoryName_ShouldReturnQuestionDirecory()
        {
            //Arrange
            var expectedPath = "BuildDirectory\\content\\ObjectiveId\\QuestionId";

            //Act
            var result = _buildPathProvider.GetQuestionDirectoryName(BuildDirectory, ObjectiveId, QuestionId);

            //Assert
            result.Should().Be(expectedPath);
        }

        #endregion

        #region GetLearningContentFileName

        [TestMethod]
        public void GetLearningContentFileName_ShouldReturnLearningContentFileName()
        {
            //Arrange
            var expectedPath = "BuildDirectory\\content\\ObjectiveId\\QuestionId\\LearningContentId.html";

            //Act
            var result = _buildPathProvider.GetLearningContentFileName(BuildDirectory, ObjectiveId, QuestionId, LearningContentId);

            //Assert
            result.Should().Be(expectedPath);
        }

        #endregion

        #region GetQuestionContentFileName

        [TestMethod]
        public void GetQuestionContentFileName_ShouldReturnLearningQuestionFileName()
        {
            //Arrange
            var expectedPath = "BuildDirectory\\content\\ObjectiveId\\QuestionId\\content.html";

            //Act
            var result = _buildPathProvider.GetQuestionContentFileName(BuildDirectory, ObjectiveId, QuestionId);

            //Assert
            result.Should().Be(expectedPath);
        }

        #endregion

        #region GetDataFileName

        [TestMethod]
        public void GetDataFileName_ShouldReturnJsonDataFileName()
        {
            //Arrange
            var expectedPath = "BuildDirectory\\content\\data.js";

            //Act
            var result = _buildPathProvider.GetDataFileName(BuildDirectory);

            //Assert
            result.Should().Be(expectedPath);
        }

        #endregion

        #region GetSettingsFileName

        [TestMethod]
        public void GetSettingsFileName_ShouldReturnSettingsFile()
        {
            //Arrange
            var expectedPath = "BuildDirectory\\settings.js";

            //Act
            var result = _buildPathProvider.GetSettingsFileName(BuildDirectory);

            //Assert
            result.Should().Be(expectedPath);
        }

        #endregion

        #region GetPublishSettingsFileName

        [TestMethod]
        public void GetPublishSettingsFileName_ShouldReturnPublishSettingsPath()
        {
            //Arrange
            var buildDirectory = "BuildDirectory";
            var expectedPath = "BuildDirectory\\publishSettings.js";

            //Act
            var result = _buildPathProvider.GetPublishSettingsFileName(buildDirectory);

            //Assert
            result.Should().Be(expectedPath);
        }

        #endregion

        #region GetTemplateDirectoryName

        [TestMethod]
        public void GetTemplateDirectoryName_ShouldReturnTemplateDirecory()
        {
            //Arrange
            var templateName = "TemplateName";
            var expectedPath = Path.Combine(TemplatesPath, templateName);

            //Act
            var result = _buildPathProvider.GetTemplateDirectoryName(templateName);

            //Assert
            result.Should().Be(expectedPath);
        }

        #endregion

        #region GetBuildPackageFileName

        [TestMethod]
        public void GetBuildPackageFileName_ShouldReturnPackageFileName()
        {
            //Arrange
            var buildId = "BuildId";
            var expectedPath = Path.Combine(DownloadPath, buildId + ".zip");

            //Act
            var result = _buildPathProvider.GetBuildPackageFileName(buildId);

            //Assert
            result.Should().Be(expectedPath);
        }

        #endregion

        #region GetDownloadPath

        [TestMethod]
        public void GetDownloadPath_ShouldReturnDownloadPath()
        {
            //Arrage
            var expectedPath = DownloadPath;

            //Act
            var result = _buildPathProvider.GetDownloadPath();

            //Assert
            result.Should().Be(expectedPath);
        }

        #endregion

        #region GetPublishFolderPath

        [TestMethod]
        public void GetPublishFolderPath_ShouldReturnCoursePublishFolder()
        {
            //Arrange
            var courseId = "courseId";

            //Act
            var result = _buildPathProvider.GetPublishFolderPath(courseId);

            //Assert
            result.Should().Be(PublishPath + "\\courseId");
        }

        #endregion

        #region GetPublishedResourcePath

        [TestMethod]
        public void GetPublishedResourcePath_ShouldReturnPublishedResource()
        {
            //Arrange
            var resource = "resource";

            //Act
            var result = _buildPathProvider.GetPublishedResourcePath(resource);

            //Assert
            result.Should().Be(PublishPath + "\\resource");
        }

        #endregion

        #region GetPreviewFolderPath

        [TestMethod]
        public void GetPreviewFolderPath_ShouldReturnCoursePreviewFolder()
        {
            //Arrange
            var courseId = "courseId";

            //Act
            var result = _buildPathProvider.GetPreviewFolderPath(courseId);

            //Assert
            result.Should().Be(PreviewPath + "\\courseId");
        }

        #endregion

        #region GetPreviewResourcePath

        [TestMethod]
        public void GetPreviewResourcePath_ShouldReturnPreviewResource()
        {
            //Arrange
            var resource = "resource";

            //Act
            var result = _buildPathProvider.GetPreviewResourcePath(resource);

            //Assert
            result.Should().Be(PreviewPath + "\\resource");
        }

        #endregion

        #region GetBuildedPackagePath

        [TestMethod]
        public void GetBuildedPackagePath_ReturnPackagePath()
        {
            //Arrange
            var packagePath = "packagePath";

            //Act
            var result = _buildPathProvider.GetBuildedPackagePath(packagePath);

            //Assert
            result.Should().Be(DownloadPath + "\\packagePath");
        }

        #endregion
    }
}
