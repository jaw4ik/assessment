using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Import.Presentation;
using easygenerator.Web.Import.Presentation.Mappers;
using easygenerator.Web.Import.Presentation.Model;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.IO;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.Web.Import.WinToWeb;
using easygenerator.Web.Import.WinToWeb.Mappers;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class CourseImportControllerTests
    {
        private IPrincipal _user;
        private HttpContextBase _context;
        private IEntityMapper _entityMapper;
        private CourseImportController _controller;
        private ICourseRepository _courseRepository;
        private ConfigurationReader _configurationReader;
        private IPresentationModelMapper _presentationModelMapper;
        private IPresentationCourseImporter _presentationCourseImporter;
        private IWinToWebModelMapper _winToWebModelMapper;
        private IWinToWebCourseImporter _winToWebCourseImporter;

        [TestInitialize]
        public void InitializeContext()
        {
            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _entityMapper = Substitute.For<IEntityMapper>();
            _courseRepository = Substitute.For<ICourseRepository>();
            _configurationReader = Substitute.For<ConfigurationReader>();
            _presentationModelMapper = Substitute.For<IPresentationModelMapper>();
            _presentationCourseImporter = Substitute.For<IPresentationCourseImporter>();
            _winToWebCourseImporter = Substitute.For<IWinToWebCourseImporter>();
            _winToWebModelMapper = Substitute.For<IWinToWebModelMapper>();

            _controller = new CourseImportController(_entityMapper, _courseRepository, _configurationReader, _presentationModelMapper, _presentationCourseImporter, _winToWebModelMapper, _winToWebCourseImporter);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        [TestMethod]
        public void ImportFromPresentation_ShouldReturnBadRequest_WhenInputFileIsNull()
        {
            //Arrange


            //Act
            var result = _controller.ImportFromPresentation(null);

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void ImportFromPresentation_ShouldReturnRequestEntityTooLargeHttpStatusCode_WhenFileIsTooLarge()
        {
            //Arrange
            var file = Substitute.For<HttpPostedFileBase>();
            file.FileName.Returns("fileName");
            file.ContentLength.Returns(2);

            _configurationReader.CourseImportConfiguration.Returns(new CourseImportConfigurationSection() { PresentationMaximumFileSize = 1 });

            //Act
            var result = _controller.ImportFromPresentation(file);

            //Assert
            result.Should().BeHttpStatusCodeResult().And.StatusCode.Should().Be(413);
        }

        [TestMethod]
        public void ImportFromPresentation_ShouldReturnBadRequest_WhenFileIsNotPresentation()
        {
            //Arrange
            var file = Substitute.For<HttpPostedFileBase>();
            file.FileName.Returns("fileName");
            file.ContentLength.Returns(1);

            _configurationReader.CourseImportConfiguration.Returns(new CourseImportConfigurationSection() { PresentationMaximumFileSize = 1 });

            _presentationModelMapper.Map(Arg.Any<Stream>()).Returns((Presentation)null);

            //Act
            var result = _controller.ImportFromPresentation(file);

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void ImportFromPresentation_ShouldAddCourseToRepository()
        {
            //Arrange
            var file = Substitute.For<HttpPostedFileBase>();
            file.FileName.Returns("fileName");
            file.ContentLength.Returns(1);

            _configurationReader.CourseImportConfiguration.Returns(new CourseImportConfigurationSection() { PresentationMaximumFileSize = 1 });

            _presentationModelMapper.Map(Arg.Any<Stream>()).Returns(Substitute.For<Presentation>());

            var course = Substitute.For<Course>();
            _presentationCourseImporter.Import(Arg.Any<Presentation>(), Arg.Any<string>(), Arg.Any<string>()).Returns(course);

            //Act
            _controller.ImportFromPresentation(file);


            //Assert
            _courseRepository.Received().Add(course);
        }

        [TestMethod]
        public void ImportFromPresentation_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var file = Substitute.For<HttpPostedFileBase>();
            file.FileName.Returns("fileName");
            file.ContentLength.Returns(1);

            _configurationReader.CourseImportConfiguration.Returns(new CourseImportConfigurationSection() { PresentationMaximumFileSize = 1 });

            _presentationModelMapper.Map(Arg.Any<Stream>()).Returns(Substitute.For<Presentation>());
            _presentationCourseImporter.Import(Arg.Any<Presentation>(), Arg.Any<string>(), Arg.Any<string>())
                .Returns(Substitute.For<Course>());

            //Act
            var result = _controller.ImportFromPresentation(file);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

    }
}
