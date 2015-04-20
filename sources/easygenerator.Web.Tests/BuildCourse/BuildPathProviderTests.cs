using System.IO;
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

        #region GetIncludedModulesDirectoryPath

        [TestMethod]
        public void GetIncludedModulesDirectoryPath_ShouldReturnIncludedModulesPath()
        {
            //Arrange
            var buildDirectory = "BuildDirectory";
            var expectedPath = "BuildDirectory\\includedModules";

            //Act
            var result = _buildPathProvider.GetIncludedModulesDirectoryPath(buildDirectory);

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

        #region GetCorrectFeedbackContentFileName

        [TestMethod]
        public void GetCorrectFeedbackContentFileName_ReturnPackagePath()
        {
            //Arrange
            var packagePath = "packagePath";
            var objectiveId = "objectiveId";
            var questionId = "questionId";

            //Act
            var result = _buildPathProvider.GetCorrectFeedbackContentFileName(packagePath, objectiveId, questionId);

            //Assert
            result.Should().Be("packagePath\\content\\objectiveId\\questionId\\correctFeedback.html");
        }

        #endregion

        #region GetIncorrectFeedbackContentFileName

        [TestMethod]
        public void GetIncorrectFeedbackContentFileName_ReturnPackagePath()
        {
            //Arrange
            var packagePath = "packagePath";
            var objectiveId = "objectiveId";
            var questionId = "questionId";

            //Act
            var result = _buildPathProvider.GetIncorrectFeedbackContentFileName(packagePath, objectiveId, questionId);

            //Assert
            result.Should().Be("packagePath\\content\\objectiveId\\questionId\\incorrectFeedback.html");
        }

        #endregion

        #region GetGeneralFeedbackContentFileName

        [TestMethod]
        public void GetGeneralFeedbackContentFileName_ReturnPackagePath()
        {
            //Arrange
            var packagePath = "packagePath";
            var objectiveId = "objectiveId";
            var questionId = "questionId";

            //Act
            var result = _buildPathProvider.GetGeneralFeedbackContentFileName(packagePath, objectiveId, questionId);

            //Assert
            result.Should().Be("packagePath\\content\\objectiveId\\questionId\\generalFeedback.html");
        }

        #endregion
    }
}
