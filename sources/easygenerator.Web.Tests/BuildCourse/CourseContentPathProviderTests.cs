using easygenerator.Web.BuildCourse;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.Web.Tests.BuildCourse
{
    [TestClass]
    public class CourseContentPathProviderTests
    {
        private const string BuildDirectory = "BuildDirectory";
        private const string ObjectiveId = "ObjectiveId";
        private const string QuestionId = "QuestionId";
        private const string LearningContentId = "LearningContentId";

        private CourseContentPathProvider _courseContentPathProvider;

        [TestInitialize]
        public void InitializeContext()
        {
            _courseContentPathProvider = new CourseContentPathProvider();
        }

        #region GetContentDirectoryName

        [TestMethod]
        public void GetContentDirectoryName_ShouldReturnContentDirectory()
        {
            //Arrange
            var expectedPath = "BuildDirectory\\content";

            //Act
            var result = _courseContentPathProvider.GetContentDirectoryName(BuildDirectory);

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
            var result = _courseContentPathProvider.GetCourseIntroductionContentFileName(BuildDirectory);

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
            var result = _courseContentPathProvider.GetObjectiveDirectoryName(BuildDirectory, ObjectiveId);

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
            var result = _courseContentPathProvider.GetQuestionDirectoryName(BuildDirectory, ObjectiveId, QuestionId);

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
            var result = _courseContentPathProvider.GetLearningContentFileName(BuildDirectory, ObjectiveId, QuestionId, LearningContentId);

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
            var result = _courseContentPathProvider.GetQuestionContentFileName(BuildDirectory, ObjectiveId, QuestionId);

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
            var result = _courseContentPathProvider.GetDataFileName(BuildDirectory);

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
            var result = _courseContentPathProvider.GetSettingsFileName(BuildDirectory);

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
            var result = _courseContentPathProvider.GetPublishSettingsFileName(buildDirectory);

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
            var result = _courseContentPathProvider.GetIncludedModulesDirectoryPath(buildDirectory);

            //Assert
            result.Should().Be(expectedPath);
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
            var result = _courseContentPathProvider.GetCorrectFeedbackContentFileName(packagePath, objectiveId, questionId);

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
            var result = _courseContentPathProvider.GetIncorrectFeedbackContentFileName(packagePath, objectiveId, questionId);

            //Assert
            result.Should().Be("packagePath\\content\\objectiveId\\questionId\\incorrectFeedback.html");
        }

        #endregion
    }
}
