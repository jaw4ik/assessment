using System;
using easygenerator.Web.BuildLearningPath;
using easygenerator.Web.Components;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.BuildLearningPath
{
    [TestClass]
    public class LearningPathContentPathProviderTests
    {
        private HttpRuntimeWrapper _httpRuntimeWrapper;
        private LearningPathContentPathProvider _contentPathProvider;

        [TestInitialize]
        public void InitializeContext()
        {
            _httpRuntimeWrapper = Substitute.For<HttpRuntimeWrapper>();
            _httpRuntimeWrapper.GetDomainAppPath().Returns("WebsitePath");

            _contentPathProvider = new LearningPathContentPathProvider(_httpRuntimeWrapper);
        }

        #region GetContentDirectoryName

        [TestMethod]
        public void GetContentDirectoryName_ShouldReturnContentDirectory()
        {
            //Arrange
            var buildDirectoryPath = "buildDirectory";

            //Act
            var contentDirectory = _contentPathProvider.GetContentDirectoryName(buildDirectoryPath);

            //Assert
            contentDirectory.Should().Be("buildDirectory\\data");
        }

        #endregion

        #region GetLearningPathModelFileName

        [TestMethod]
        public void GetLearningPathModelFileName_ShouldReturnModelFileName()
        {
            //Arrange
            var buildDirectoryPath = "buildDirectory";

            //Act
            var modelFile = _contentPathProvider.GetLearningPathModelFileName(buildDirectoryPath);

            //Assert
            modelFile.Should().Be("buildDirectory\\data\\data.json");
        }

        #endregion

        #region GetLearningPathTemplatePath

        [TestMethod]
        public void GetLearningPathTemplatePath_ShouldReturnTemplatePath()
        {
            //Arrange


            //Act
            var templatePath = _contentPathProvider.GetLearningPathTemplatePath();

            //Assert
            templatePath.Should().Be("WebsitePath\\BuildLearningPath\\Template");
        }

        #endregion

        #region GetCourseDirectoryName

        [TestMethod]
        public void GetCourseDirectoryName_ShouldReturnCourseDirectory()
        {
            //Arrange
            var buildDirectoryPath = "buildDirectory";
            var courseId = "courseId";

            //Act
            var result = _contentPathProvider.GetCourseDirectoryName(buildDirectoryPath, courseId);

            //Assert
            result.Should().Be("buildDirectory\\data\\courseId");
        }

        #endregion

        #region GetCourseLink

        [TestMethod]
        public void GetCourseLink_ShouldReturnLinkToCourse()
        {
            //Arrange
            var courseId = "courseId";

            //Act
            var result = _contentPathProvider.GetCourseLink(courseId);

            //Assert
            result.Should().Be("data/courseId/index.html");
        }

        #endregion
    }
}
