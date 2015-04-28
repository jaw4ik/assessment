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
        private IPresentationModelMapper _mapper;
        private IPresentationCourseImporter _importer;

        [TestInitialize]
        public void InitializeContext()
        {
            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _entityMapper = Substitute.For<IEntityMapper>();
            _courseRepository = Substitute.For<ICourseRepository>();
            _configurationReader = Substitute.For<ConfigurationReader>();
            _mapper = Substitute.For<IPresentationModelMapper>();
            _importer = Substitute.For<IPresentationCourseImporter>();

            _controller = new CourseImportController(_entityMapper, _courseRepository, _configurationReader, _mapper, _importer);
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

            _mapper.Map(Arg.Any<Stream>()).Returns((Presentation)null);

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

            _mapper.Map(Arg.Any<Stream>()).Returns(Substitute.For<Presentation>());

            var course = Substitute.For<Course>();
            _importer.Import(Arg.Any<Presentation>(), Arg.Any<string>(), Arg.Any<string>()).Returns(course);

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

            _mapper.Map(Arg.Any<Stream>()).Returns(Substitute.For<Presentation>());
            _importer.Import(Arg.Any<Presentation>(), Arg.Any<string>(), Arg.Any<string>())
                .Returns(Substitute.For<Course>());

            //Act
            var result = _controller.ImportFromPresentation(file);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

    }
}
