using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.Components;
using easygenerator.Web.Controllers;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;

namespace easygenerator.Web.Tests.Controllers
{
    [TestClass]
    public class PreviewControllerTests
    {
        private PreviewController _controller;
        private BuildPathProvider _buildPathProvider;
        private PhysicalFileManager _physicalFileManager;
        private PackageModelMapper _packageModelMapper;

        [TestInitialize]
        public void Initialize()
        {
            _buildPathProvider = Substitute.For<BuildPathProvider>(Substitute.For<HttpRuntimeWrapper>());
            _physicalFileManager = Substitute.For<PhysicalFileManager>();
            var urlHelper = Substitute.For<IUrlHelperWrapper>();
            _packageModelMapper = Substitute.For<PackageModelMapper>(urlHelper);

            _controller = new PreviewController(_buildPathProvider, _physicalFileManager, _packageModelMapper);
        }

        #region GetPreviewCourseSettings

        [TestMethod]
        public void GetPreviewCourseSettings_ShouldReturnHttpNotFoundCodeResult_WhenCourseDoesNotExist()
        {
            //Arrange

            //Act
            var result = _controller.GetPreviewCourseSettings(null);

            //Assert
            result.Should().BeHttpNotFoundResult();
        }


        [TestMethod]
        public void GetPreviewCourseSettings_ShouldGetRemplateSettings()
        {
            //Arrange
            var course = Substitute.For<Course>();

            //Act
            _controller.GetPreviewCourseSettings(course);

            //Assert
            course.Received().GetTemplateSettings(course.Template);
        }

        [TestMethod]
        public void GetPreviewCourseSettings_ShouldReturnContentResult()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            var result = _controller.GetPreviewCourseSettings(course);

            //Assert
            result.Should().BeContentResult();
        }

        #endregion

        #region GetPreviewCourseContent

        [TestMethod]
        public void GetPreviewCourseContent_ShouldReturnHttpNotFoundCodeResult_WhenCourseDoesNotExist()
        {
            //Arrange

            //Act
            var result = _controller.GetPreviewCourseContent(null);

            //Assert
            result.Should().BeHttpNotFoundResult();
        }

        [TestMethod]
        public void GetPreviewCourseContent_ShouldReturnContentResult()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            var result = _controller.GetPreviewCourseContent(course);

            //Assert
            result.Should().BeContentResultWithValue(course.IntroductionContent);
        }

        #endregion

        #region GetPreviewQuestionContent

        [TestMethod]
        public void GetPreviewQuestionContent_ShouldReturnHttpNotFoundCodeResult_WhenCourseDoesNotExist()
        {
            //Arrange

            //Act
            var result = _controller.GetPreviewQuestionContent(null);

            //Assert
            result.Should().BeHttpNotFoundResult();
        }

        [TestMethod]
        public void GetPreviewQuestionContent_ShouldReturnContentResult()
        {
            //Arrange
            var question = Substitute.For<Question>();

            //Act
            var result = _controller.GetPreviewQuestionContent(question);

            //Assert
            result.Should().BeContentResultWithValue(question.Content);
        }

        #endregion

        #region GetPreviewLearningContent

        [TestMethod]
        public void GetPreviewLearningContent_ShouldReturnHttpNotFoundCodeResult_WhenCourseDoesNotExist()
        {
            //Arrange

            //Act
            var result = _controller.GetPreviewLearningContent(null);

            //Assert
            result.Should().BeHttpNotFoundResult();
        }

        [TestMethod]
        public void GetPreviewLearningContentt_ShouldReturnContentResult()
        {
            //Arrange
            var learningContent = LearningContentObjectMother.Create("text");

            //Act
            var result = _controller.GetPreviewLearningContent(learningContent);

            //Assert
            result.Should().BeContentResultWithValue(learningContent.Text);
        }

        #endregion

        #region GetPreviewCorrectFeedback

        [TestMethod]
        public void GetPreviewCorrectFeedback_ShouldReturnHttpNotFoundCodeResult_WhenQuestionDoesNotExist()
        {
            //Act
            var result = _controller.GetPreviewCorrectFeedback(null);

            //Assert
            result.Should().BeHttpNotFoundResult();
        }

        [TestMethod]
        public void GetPreviewCorrectFeedback_ShouldReturnCorrectFeedbackContent()
        {
            //Arrange
            const String correctFeedbackContent = "<p>Correct feedback</p>";
            var question = MultipleselectObjectMother.Create();
            question.UpdateCorrectFeedbackText(correctFeedbackContent);

            //Act
            var result = _controller.GetPreviewCorrectFeedback(question);

            //Assert
            result.Should().BeContentResultWithValue(correctFeedbackContent);
        }

        #endregion

        #region GetPreviewIncorrectFeedback

        [TestMethod]
        public void GetPreviewIncorrectFeedback_ShouldReturnHttpNotFoundCodeResult_WhenQuestionDoesNotExist()
        {
            //Act
            var result = _controller.GetPreviewIncorrectFeedback(null);

            //Assert
            result.Should().BeHttpNotFoundResult();
        }

        [TestMethod]
        public void GetPreviewIncorrectFeedback_ShouldReturnCorrectFeedbackContent()
        {
            //Arrange
            const String incorrectFeedbackContent = "<p>Incorrect feedback</p>";
            var question = MultipleselectObjectMother.Create();
            question.UpdateIncorrectFeedbackText(incorrectFeedbackContent);

            //Act
            var result = _controller.GetPreviewIncorrectFeedback(question);

            //Assert
            result.Should().BeContentResultWithValue(incorrectFeedbackContent);
        }

        #endregion

        #region GetPreviewCourseData

        [TestMethod]
        public void GetPreviewCourseData_ShouldReturnHttpNotFoundCodeResult_WhenCourseDoesNotExist()
        {
            //Arrange

            //Act
            var result = _controller.GetPreviewCourseData(null);

            //Assert
            result.Should().BeHttpNotFoundResult();
        }

        [TestMethod]
        public void GetPreviewCourseData_ShouldMapCourse()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            _controller.GetPreviewCourseData(course);

            //Assert
            _packageModelMapper.Received().MapCourse(course);
        }

        [TestMethod]
        public void GetPreviewCourseData_ShouldReturnJsonResult()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            var result = _controller.GetPreviewCourseData(course);

            //Assert
            result.Should().BeJsonDataResult();
        }

        #endregion

        #region GetPreviewResource

        [TestMethod]
        public void GetPreviewResource_ShouldReturnHttpNotFoundCodeResult_WhenResourceDoesNotExist()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _physicalFileManager.FileExists(Arg.Any<string>()).Returns(false);

            //Act
            var result = _controller.GetPreviewResource(course, "resourceId");

            //Assert
            result.Should().BeHttpNotFoundResult();
        }

        [TestMethod]
        public void GetPreviewResource_ShouldReturnHttpNotFoundCodeResult_WhenCourseDoesNotExist()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _physicalFileManager.FileExists(Arg.Any<string>()).Returns(true);

            //Act
            var result = _controller.GetPreviewResource(null, "resourceId");

            //Assert
            result.Should().BeHttpNotFoundResult();
        }

        [TestMethod]
        public void GetPreviewResource_ShouldReturnFilePathResult_WhenResourceExists()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _physicalFileManager.FileExists(Arg.Any<string>()).Returns(true);

            //Act
            var result = _controller.GetPreviewResource(course, "resourceId");

            //Assert
            result.Should().BeFilePathResult();
        }

        [TestMethod]
        public void GetPreviewResource_ShouldGetTemplateDirectory()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _physicalFileManager.FileExists(Arg.Any<string>()).Returns(true);

            //Act
            _controller.GetPreviewResource(course, "resourceId");

            //Assert
            _buildPathProvider.Received().GetTemplateDirectoryName(course.Template.Name);
        }

        #endregion
    }
}
