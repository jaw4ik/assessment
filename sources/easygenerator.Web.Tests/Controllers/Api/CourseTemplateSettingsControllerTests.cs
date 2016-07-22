using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class CourseTemplateSettingsControllerTests
    {
        private CourseTemplateSettingsController _controller;

        private IEntityMapper _entityMapper;
        private IDomainEventPublisher _eventPublisher;
        private IThemeRepository _themeRepository;


        [TestInitialize]
        public void InitializeContext()
        {
            _entityMapper = Substitute.For<IEntityMapper>();
            _eventPublisher = Substitute.For<IDomainEventPublisher>();
            _themeRepository = Substitute.For<IThemeRepository>();

            _controller = new CourseTemplateSettingsController(_entityMapper, _themeRepository, _eventPublisher);
        }

        #region GetTemplateSettings

        [TestMethod]
        public void GetTemplateSettings_ShouldReturnHttpNotFound_WhenCourseIsNull()
        {
            //Arrange


            //Act
            var result = _controller.GetTemplateSettings(null, Substitute.For<Template>());

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.CourseNotFoundError);
        }

        [TestMethod]
        public void GetTemlateSettings_ShouldReturnHttpNotFound_WhenTemplateIsNull()
        {
            //Arrange


            //Act
            var result = _controller.GetTemplateSettings(Substitute.For<Course>(), null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.TemplateNotFoundError);
        }

        [TestMethod]
        public void GetTemplateSettings_ShouldReturnJsonResultWithTemplateSettingsAndExtraData()
        {
            //Arrange
            const string settings = "settings";
            const string extraData = "settings";
            var course = Substitute.For<Course>();
            var template = Substitute.For<Template>();
            course.GetTemplateSettings(template).Returns(settings);
            course.GetExtraDataForTemplate(template).Returns(extraData);

            //Act
            var result = _controller.GetTemplateSettings(course, template);

            //Assert
            result.Should().BeJsonResult().And.Data.ShouldBeSimilar(new { settings = settings, extraData = extraData });
        }

        [TestMethod]
        public void GetTemplateSettings_ShouldReturnJsonResultUsingGetRequest()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var template = Substitute.For<Template>();

            //Act
            var result = _controller.GetTemplateSettings(course, template);

            //Assert
            result.Should().BeJsonResult().And.JsonRequestBehavior.Should().Be(JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region  SaveTemplateSettings

        [TestMethod]
        public void SaveTemplateSettings_ShouldReturnHttpNotFound_WhenCourseIsNull()
        {
            //Arrange


            //Act
            var result = _controller.SaveTemplateSettings(null, Substitute.For<Template>(), null, null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.CourseNotFoundError);
        }

        [TestMethod]
        public void SaveTemplateSettings_ShouldReturnHttpNotFound_WhenTemplateIsNull()
        {
            //Arrange


            //Act
            var result = _controller.SaveTemplateSettings(Substitute.For<Course>(), null, null, null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.TemplateNotFoundError);
        }

        [TestMethod]
        public void SaveTemplateSettings_ShouldSaveTemplateSettings()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var template = Substitute.For<Template>();
            const string settings = "settings";
            const string extraData = "extra data";

            //Act
            _controller.SaveTemplateSettings(course, template, settings, extraData);

            //Assert
            course.Received().SaveTemplateSettings(template, settings, extraData);

        }

        [TestMethod]
        public void SaveTemplateSettings_ShouldReturnJsonResult()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var template = Substitute.For<Template>();
            const string settings = "settings";
            const string extraData = "extra data";

            //Act
            var result = _controller.SaveTemplateSettings(course, template, settings, extraData);

            //Assert
            result.Should().BeJsonResult().And.Data.Should().Be(true);
        }

        #endregion

        #region  AddTheme

        [TestMethod]
        public void AddTheme_ShouldReturnHttpNotFound_WhenCourseIsNull()
        {
            //Arrange


            //Act
            var result = _controller.AddTheme(null, Substitute.For<Template>(), null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.CourseNotFoundError);
        }

        [TestMethod]
        public void AddTheme_ShouldReturnHttpNotFound_WhenTemplateIsNull()
        {
            //Arrange


            //Act
            var result = _controller.AddTheme(Substitute.For<Course>(), null, null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.TemplateNotFoundError);
        }

        [TestMethod]
        public void AddTheme_ShouldReturnHttpNotFound_WhenThemeIsNull()
        {
            //Arrange


            //Act
            var result = _controller.AddTheme(Substitute.For<Course>(), Substitute.For<Template>(), null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.ThemeNotFoundError);
        }

        [TestMethod]
        public void AddTheme_ShouldAddThemeToCourse()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var template = Substitute.For<Template>();
            var theme = Substitute.For<Theme>();

            //Act
            _controller.AddTheme(course, template, theme);

            //Assert
            course.Received().AddTemplateTheme(template, theme);

        }

        [TestMethod]
        public void AddTheme_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var template = Substitute.For<Template>();
            var theme = Substitute.For<Theme>();

            //Act
            var result = _controller.AddTheme(course, template, theme);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region  RemoveTheme

        [TestMethod]
        public void RemoveTheme_ShouldReturnHttpNotFound_WhenCourseIsNull()
        {
            //Arrange


            //Act
            var result = _controller.RemoveTheme(null, Substitute.For<Template>());

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.CourseNotFoundError);
        }

        [TestMethod]
        public void RemoveTheme_ShouldReturnHttpNotFound_WhenTemplateIsNull()
        {
            //Arrange


            //Act
            var result = _controller.RemoveTheme(Substitute.For<Course>(), null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.TemplateNotFoundError);
        }


        [TestMethod]
        public void RemoveTheme_ShouldGetSettingsWithTheme()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var template = TemplateObjectMother.Create();

            //Act
            _controller.RemoveTheme(course, template);

            //Assert
            _themeRepository.Received().GetCourseTemplateSettingsWithTheme(course.Id, template.Id);
        }

        [TestMethod]
        public void RemoveTheme_ShouldRemoveThemeFromSettings()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var template = TemplateObjectMother.Create();
            var settings = new CourseTemplateSettings();
            settings.Theme = Substitute.For<Theme>();
            _themeRepository.GetCourseTemplateSettingsWithTheme(course.Id, template.Id).Returns(settings);

            //Act
            _controller.RemoveTheme(course, template);

            //Assert
            settings.Theme.Should().BeNull();
        }

        [TestMethod]
        public void RemoveTheme_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var template = Substitute.For<Template>();

            //Act
            var result = _controller.RemoveTheme(course, template);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion
    }
}
