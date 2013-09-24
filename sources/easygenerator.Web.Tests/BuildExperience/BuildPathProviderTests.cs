using System.IO;
using easygenerator.Web.BuildExperience;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace easygenerator.Web.Tests.BuildExperience
{
    [TestClass]
    public class BuildPathProviderTests
    {
        private Mock<HttpRuntimeWrapper> _httpRuntimeWrapperMock;
        private BuildPathProvider _buildPathProvider;

        private string BuildPath { get; set; }
        private string WebsitePath { get; set; }
        private string TemplatesPath { get; set; }
        private string DownloadPath { get; set; }

        [TestInitialize]
        public void InitializeContext()
        {
            _httpRuntimeWrapperMock = new Mock<HttpRuntimeWrapper>();
            _httpRuntimeWrapperMock.Setup(instance => instance.GetDomainAppPath()).Returns("Some app path");

            _buildPathProvider = new BuildPathProvider(_httpRuntimeWrapperMock.Object);

            BuildPath = Path.Combine(Path.GetTempPath(), "eg", "build");
            WebsitePath = _httpRuntimeWrapperMock.Object.GetDomainAppPath();
            TemplatesPath = Path.Combine(WebsitePath, "Templates");
            DownloadPath = Path.Combine(WebsitePath, "Download");
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
            Assert.AreEqual(expectedPath, result);
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
            Assert.AreEqual(expectedPath, result);
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
            Assert.AreEqual(expectedPath, result);
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
            Assert.AreEqual(expectedPath, result);
        }

        #endregion

        #region GetLearningObjectFileName

        [TestMethod]
        public void GetLearningObjectFileName_ShouldReturnLearningObjectFileName()
        {
            //Arrange
            var buildId = "BuildId";
            var objectiveId = "ObjectiveId";
            var questionId = "QuestionId";
            var learningObjectId = "LearningObjectId";
            var expectedPath = Path.Combine(_buildPathProvider.GetQuestionDirectoryName(buildId, objectiveId, questionId), learningObjectId + ".html");

            //Act
            var result = _buildPathProvider.GetLearningObjectFileName(buildId, objectiveId, questionId, learningObjectId);

            //Assert
            Assert.AreEqual(expectedPath, result);
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
            Assert.AreEqual(expectedPath, result);
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
            Assert.AreEqual(expectedPath, result);
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
            Assert.AreEqual(expectedPath, result);
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
            Assert.AreEqual(expectedPath, result);
        }

        #endregion
    }
}
