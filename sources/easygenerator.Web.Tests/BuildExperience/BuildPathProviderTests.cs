using System.IO;
using easygenerator.Web.BuildExperience;
using easygenerator.Web.Components;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.BuildExperience
{
    [TestClass]
    public class BuildPathProviderTests
    {
        private HttpRuntimeWrapper _httpRuntimeWrapper;
        private BuildPathProvider _buildPathProvider;

        private string BuildPath { get; set; }
        private string WebsitePath { get; set; }
        private string TemplatesPath { get; set; }
        private string DownloadPath { get; set; }
        private string PublishPath { get; set; }

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

        #region GetObjectiveDirectoryName

        [TestMethod]
        public void GetObjectiveDirectoryName_ShouldReturnObjectiveDirecory()
        {
            //Arrange
            var buildId = "BuildId";
            var objectiveId = "ObjectiveId";
            var expectedPath = Path.Combine(_buildPathProvider.GetContentDirectoryName(buildId), objectiveId);

            //Act
            var result = _buildPathProvider.GetObjectiveDirectoryName(buildId, objectiveId);

            //Assert
            result.Should().Be(expectedPath);
        }

        #endregion

        #region GetQuestionDirectoryName

        [TestMethod]
        public void GetQuestionDirectoryName_ShouldReturnQuestionDirecory()
        {
            //Arrange
            var buildId = "BuildId";
            var objectiveId = "ObjectiveId";
            var questionId = "QuestionId";
            var expectedPath = Path.Combine(_buildPathProvider.GetObjectiveDirectoryName(buildId, objectiveId), questionId);

            //Act
            var result = _buildPathProvider.GetQuestionDirectoryName(buildId, objectiveId, questionId);

            //Assert
            result.Should().Be(expectedPath);
        }

        #endregion

        #region GetLearningContentFileName

        [TestMethod]
        public void GetLearningContentFileName_ShouldReturnLearningContentFileName()
        {
            //Arrange
            var buildId = "BuildId";
            var objectiveId = "ObjectiveId";
            var questionId = "QuestionId";
            var learningContentId = "LearningContentId";
            var expectedPath = Path.Combine(_buildPathProvider.GetQuestionDirectoryName(buildId, objectiveId, questionId), learningContentId + ".html");

            //Act
            var result = _buildPathProvider.GetLearningContentFileName(buildId, objectiveId, questionId, learningContentId);

            //Assert
            result.Should().Be(expectedPath);
        }

        #endregion

        #region GetDataFileName

        [TestMethod]
        public void GetDataFileName_ShouldReturnJsonDataFileName()
        {
            //Arrange
            var buildId = "BuildId";
            var expectedPath = Path.Combine(_buildPathProvider.GetContentDirectoryName(buildId), "data.js");

            //Act
            var result = _buildPathProvider.GetDataFileName(buildId);

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

        #region GetContentDirectoryName

        [TestMethod]
        public void GetContentDirectoryName_ShouldReturnContentDirectory()
        {
            //Arrange
            var buildId = "BuildId";
            var expectedPath = Path.Combine(BuildPath, buildId, "content");

            //Act
            var result = _buildPathProvider.GetContentDirectoryName(buildId);

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
    }
}
