using easygenerator.Web.BuildCourse;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.Web.Tests.BuildCourse
{
    [TestClass]
    public class CourseContentPathProviderTests
    {
        private const string BuildDirectory = "BuildDirectory";
        private const string SectionId = "SectionId";
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

        #region GetSectionDirectoryName

        [TestMethod]
        public void GetSectionDirectoryName_ShouldReturnSectionDirecory()
        {
            //Arrange
            var expectedPath = "BuildDirectory\\content\\SectionId";

            //Act
            var result = _courseContentPathProvider.GetSectionDirectoryName(BuildDirectory, SectionId);

            //Assert
            result.Should().Be(expectedPath);
        }

        #endregion

        #region GetQuestionDirectoryName

        [TestMethod]
        public void GetQuestionDirectoryName_ShouldReturnQuestionDirecory()
        {
            //Arrange
            var expectedPath = "BuildDirectory\\content\\SectionId\\QuestionId";

            //Act
            var result = _courseContentPathProvider.GetQuestionDirectoryName(BuildDirectory, SectionId, QuestionId);

            //Assert
            result.Should().Be(expectedPath);
        }

        #endregion

        #region GetLearningContentFileName

        [TestMethod]
        public void GetLearningContentFileName_ShouldReturnLearningContentFileName()
        {
            //Arrange
            var expectedPath = "BuildDirectory\\content\\SectionId\\QuestionId\\LearningContentId.html";

            //Act
            var result = _courseContentPathProvider.GetLearningContentFileName(BuildDirectory, SectionId, QuestionId, LearningContentId);

            //Assert
            result.Should().Be(expectedPath);
        }

        #endregion

        #region GetQuestionContentFileName

        [TestMethod]
        public void GetQuestionContentFileName_ShouldReturnLearningQuestionFileName()
        {
            //Arrange
            var expectedPath = "BuildDirectory\\content\\SectionId\\QuestionId\\content.html";

            //Act
            var result = _courseContentPathProvider.GetQuestionContentFileName(BuildDirectory, SectionId, QuestionId);

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

        #region GetThemeSettingsFileName

        [TestMethod]
        public void GetThemeSettingsFileName_ShouldReturnThemeSettingsFile()
        {
            //Arrange
            var expectedPath = "BuildDirectory\\themeSettings.js";

            //Act
            var result = _courseContentPathProvider.GetThemeSettingsFileName(BuildDirectory);

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
            var sectionId = "sectionId";
            var questionId = "questionId";

            //Act
            var result = _courseContentPathProvider.GetCorrectFeedbackContentFileName(packagePath, sectionId, questionId);

            //Assert
            result.Should().Be("packagePath\\content\\sectionId\\questionId\\correctFeedback.html");
        }

        #endregion

        #region GetIncorrectFeedbackContentFileName

        [TestMethod]
        public void GetIncorrectFeedbackContentFileName_ReturnPackagePath()
        {
            //Arrange
            var packagePath = "packagePath";
            var sectionId = "sectionId";
            var questionId = "questionId";

            //Act
            var result = _courseContentPathProvider.GetIncorrectFeedbackContentFileName(packagePath, sectionId, questionId);

            //Assert
            result.Should().Be("packagePath\\content\\sectionId\\questionId\\incorrectFeedback.html");
        }

        #endregion
    }
}
