using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.ThemeEvents;
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
    public class ThemeControllerTests
    {
        private ThemeController _controller;

        private IEntityMapper _entityMapper;
        private IThemeRepository _themeRepository;
        private IEntityFactory _entityFactory;
        private IDomainEventPublisher _eventPublisher;

        private IPrincipal _user;
        private HttpContextBase _context;
        private string userName = "user@easygenerator.com";

        [TestInitialize]
        public void InitializeContext()
        {
            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);

            _entityMapper = Substitute.For<IEntityMapper>();
            _themeRepository = Substitute.For<IThemeRepository>();
            _entityFactory = Substitute.For<IEntityFactory>();
            _eventPublisher = Substitute.For<IDomainEventPublisher>();

            _controller = new ThemeController(_entityMapper, _themeRepository, _entityFactory, _eventPublisher);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }


        #region GetCollection

        [TestMethod]
        public void GetCollection_ShouldReturnHttpNotFoundResult_WhenTemplateIsNull()
        {
            //Arrange


            //Act
            var result = _controller.GetCollection(null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.TemplateNotFoundError);
        }

        [TestMethod]
        public void GetCollection_ShouldGetThemeCollection()
        {
            //Arrange
            var template = Substitute.For<Template>();
            _user.Identity.Name.Returns(userName);

            //Act
            _controller.GetCollection(template);

            //Assert
            _themeRepository.Received().GetCollectionByTemplate(template, userName);
        }

        [TestMethod]
        public void GetCollection_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var template = Substitute.For<Template>();
            _user.Identity.Name.Returns(userName);
            _themeRepository.GetCollectionByTemplate(template, userName).Returns(new List<Theme>());

            //Act
            var result = _controller.GetCollection(template);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region Add theme

        [TestMethod]
        public void Add_ShouldReturnHttpNotFoundResult_WhenTemplateIsNull()
        {
            //Arrange


            //Act
            var result = _controller.Add(null, null, null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.TemplateNotFoundError);
        }

        [TestMethod]
        public void Add_ShouldAddTheme()
        {
            //Arrange
            var template = Substitute.For<Template>();
            var name = "name";
            var settings = "settings";
            var theme = Substitute.For<Theme>();
            _user.Identity.Name.Returns(userName);
            _entityFactory.Theme(template, name, settings, userName).Returns(theme);

            //Act
            _controller.Add(template, name, settings);

            //Assert
            _themeRepository.Received().Add(theme);
        }

        [TestMethod]
        public void Add_ShouldRiseThemeAddedEvent()
        {
            //Arrange
            var template = Substitute.For<Template>();
            var name = "name";
            var settings = "settings";
            var theme = Substitute.For<Theme>();
            _user.Identity.Name.Returns(userName);
            _entityFactory.Theme(template, name, settings, userName).Returns(theme);

            //Act
            _controller.Add(template, name, settings);

            //Assert
            _eventPublisher.Received().Publish(Arg.Is<ThemeAddedEvent>(_ => _.Theme == theme));
        }

        [TestMethod]
        public void Add_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var template = Substitute.For<Template>();
            var name = "name";
            var settings = "settings";
            var theme = Substitute.For<Theme>();
            _user.Identity.Name.Returns(userName);
            _entityFactory.Theme(template, name, settings, userName).Returns(theme);

            //Act
            var result = _controller.Add(template, name, settings);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region Update theme

        [TestMethod]
        public void Update_ShouldReturnHttpNotFoundResult_WhenThemeIsNull()
        {
            //Arrange


            //Act
            var result = _controller.Update(null, null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.ThemeNotFoundError);
        }

        [TestMethod]
        public void Update_ShouldUpdateTheme()
        {
            //Arrange
            var settings = "settings";
            var theme = Substitute.For<Theme>();
            _user.Identity.Name.Returns(userName);

            //Act
            _controller.Update(theme, settings);

            //Assert
            theme.Received().Update(settings, userName);
        }

        [TestMethod]
        public void Update_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var settings = "settings";
            var theme = Substitute.For<Theme>();
            _user.Identity.Name.Returns(userName);

            //Act
            var result = _controller.Update(theme, settings);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region Delete theme

        [TestMethod]
        public void Delete_ShouldReturnJsonSuccesResult_WhenThemeIsNull()
        {
            //Arrange


            //Act
            var result = _controller.DeleteTheme(null);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void Delete_ShouldRemoveThemeFromCourseTemplateSettings()
        {
            //Arrange
            var theme = Substitute.For<Theme>();
            var courseSettings = new CourseTemplateSettings() { Theme = theme };
            var courseSettingsCollection = new List<CourseTemplateSettings>(new[] { courseSettings });
            _themeRepository.GetAllCourseTemplateSettingsByTheme(theme).Returns(courseSettingsCollection);

            //Act
            _controller.DeleteTheme(theme);

            //Assert
            courseSettings.Theme.Should().BeNull();
        }

        [TestMethod]
        public void Delete_ShouldDeleteTheme()
        {
            //Arrange
            var theme = Substitute.For<Theme>();

            //Act
            _controller.DeleteTheme(theme);

            //Assert
            _themeRepository.Received().Remove(theme);
        }

        [TestMethod]
        public void Delete_ShouldRaiseThemeDeletedEvent()
        {
            //Arrange
            var theme = Substitute.For<Theme>();
            var courseSettings = new CourseTemplateSettings() { Theme = theme };
            var courseSettingsCollection = new List<CourseTemplateSettings>(new[] { courseSettings });
            _themeRepository.GetAllCourseTemplateSettingsByTheme(theme).Returns(courseSettingsCollection);

            //Act
            _controller.DeleteTheme(theme);

            //Assert
            _eventPublisher.Received().Publish(Arg.Is<ThemeDeletedEvent>(_=>_.Theme == theme && _.ChangedCourseSettings == courseSettingsCollection));
        }

        [TestMethod]
        public void Delete_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var theme = Substitute.For<Theme>();

            //Act
            var result = _controller.DeleteTheme(theme);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion
    }
}
