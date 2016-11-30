using System.Collections;
using System.Collections.Generic;
using easygenerator.DataAccess.Migrations;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.BuildCourse.Modules;
using easygenerator.Web.BuildCourse.Modules.Models;
using easygenerator.Web.BuildCourse.PublishSettings;
using easygenerator.Web.Components;
using easygenerator.Web.Controllers;
using easygenerator.Web.Storage;
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
        private PackageModelMapper _packageModelMapper;
        private PublishSettingsProvider _publishSettingsProvider;
        private PackageModulesProvider _packageModulesProvider;
        private ITemplateStorage _templateStorage;

        [TestInitialize]
        public void Initialize()
        {
            _packageModelMapper = Substitute.For<PackageModelMapper>(Substitute.For<IUrlHelperWrapper>(), Substitute.For<IUserRepository>());

            _publishSettingsProvider = Substitute.For<PublishSettingsProvider>();

            var userRepository = Substitute.For<IUserRepository>();
            _packageModulesProvider = Substitute.For<PackageModulesProvider>(userRepository);

            _templateStorage = Substitute.For<ITemplateStorage>();

            _controller = new PreviewController(_packageModelMapper, _publishSettingsProvider, _packageModulesProvider, _templateStorage);
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
        public void GetPreviewCourseSettings_ShouldGetTemplateSettings()
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

        #region GetPreviewCoursePublishSettings

        [TestMethod]
        public void GetPreviewCoursePublishSettings_ShouldReturnHttpNotFoundResult_WhenCourseDoesNotExist()
        {
            //Arrange


            //Act
            var result = _controller.GetPreviewCoursePublishSettings(null);

            //Assert
            result.Should().BeHttpNotFoundResult();
        }

        [TestMethod]
        public void GetPreviewCoursePublishSettings_ShouldGetPublishSettingsFromProvider()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            var result = _controller.GetPreviewCoursePublishSettings(course);

            //Assert
            _publishSettingsProvider.Received().GetPublishSettings(Arg.Any<IEnumerable<PackageModule>>(), PublishSettingsProvider.Mode.Preview);
        }

        [TestMethod]
        public void GetPreviewCoursePublishSettings_ShouldReturnContentResult()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            var result = _controller.GetPreviewCoursePublishSettings(course);

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

        #region GetPreviewIncludedModules

        [TestMethod]
        public void GetPreviewIncludedModules_ShouldReturnHttpNotFoundResult_WhenCourseDoesNotExist()
        {
            //Arrange

            //Act
            var result = _controller.GetPreviewIncludedModules(null, null);

            //Assert
            result.Should().BeHttpNotFoundResult();
        }

        [TestMethod]
        public void GetPreviewIncludedModules_ShouldGetModulesList_WhenCourseExists()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            _controller.GetPreviewIncludedModules(course, null);

            //Assert
            _packageModulesProvider.Received().GetModulesList(course);
        }

        [TestMethod]
        public void GetPreviewIncludedModules_ShouldReturnHttpNotFoundResult_WhenModulesListEmpty()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _packageModulesProvider.GetModulesList(course).Returns(new List<PackageModule>());

            //Act
            var result = _controller.GetPreviewIncludedModules(course, null);

            //Assert
            result.Should().BeHttpNotFoundResult();
        }

        [TestMethod]
        public void GetPreviewIncludedModules_ShouldReturnHttpNotFoundResult_WhenModuleDoesNotExist()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _packageModulesProvider.GetModulesList(course).Returns(new List<PackageModule>()
            {
                new PackageModule("module1", "path1")
            });

            //Act
            var result = _controller.GetPreviewIncludedModules(course, "module2.js");

            //Assert
            result.Should().BeHttpNotFoundResult();
        }

        [TestMethod]
        public void GetPreviewIncludedModules_ShouldReturnFilePathResult_WhenModuleExists()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            const string filePath = "filePath";
            var module = Substitute.For<PackageModule>("module1", filePath);
            module.GetFilePath().Returns(filePath);
            _packageModulesProvider.GetModulesList(course).Returns(new List<PackageModule>() { module });

            //Act
            var result = _controller.GetPreviewIncludedModules(course, "module1.js");

            //Assert
            result.Should().BeFilePathResult();
        }

        #endregion

        #region GetPreviewResource

        [TestMethod]
        public void GetPreviewResource_ShouldReturnHttpNotFoundCodeResult_WhenResourceDoesNotExist()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _templateStorage.FileExists(course.Template, Arg.Any<string>()).Returns(false);

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
            _templateStorage.FileExists(course.Template, Arg.Any<string>()).Returns(true);

            //Act
            var result = _controller.GetPreviewResource(null, "resourceId");

            //Assert
            result.Should().BeHttpNotFoundResult();
        }

        [TestMethod]
        public void GetPreviewResource_ShouldReturnFilePathResult_WhenResourceExists()
        {
            //Arrange
            const string resourse = "resourceId";
            var course = CourseObjectMother.Create();
            _templateStorage.FileExists(course.Template, Arg.Any<string>()).Returns(true);
            _templateStorage.GetAbsoluteFilePath(course.Template, resourse).Returns(resourse);

            //Act
            var result = _controller.GetPreviewResource(course, resourse);

            //Assert
            result.Should().BeFilePathResult();
        }

        #endregion
    }
}
