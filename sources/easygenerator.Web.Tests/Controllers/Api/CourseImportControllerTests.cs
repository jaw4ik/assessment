using System;
using System.IO;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Import.Presentation;
using easygenerator.Web.Import.Presentation.Model;
using easygenerator.Web.Storage;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class CourseImportControllerTests
    {
        private IPrincipal _user;
        private HttpContextBase _context;
        private IEntityMapper _entityMapper;
        private CourseImportController _controller;
        private IEntityFactory _entityFactory;
        private ICourseRepository _courseRepository;
        private ITemplateRepository _templateRepository;
        private ConfigurationReader _configurationReader;
        private PresentationMapper _mapper;

        [TestInitialize]
        public void InitializeContext()
        {
            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _entityMapper = Substitute.For<IEntityMapper>();
            _entityFactory = Substitute.For<IEntityFactory>();
            _courseRepository = Substitute.For<ICourseRepository>();
            _templateRepository = Substitute.For<ITemplateRepository>();
            _configurationReader = Substitute.For<ConfigurationReader>();
            _mapper = Substitute.For<PresentationMapper>();

            _controller = new CourseImportController(_entityMapper, _entityFactory, _courseRepository, _templateRepository, _configurationReader, _mapper);
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
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);

            //Act
            _controller.ImportFromPresentation(file);


            //Assert
            _courseRepository.Received().Add(course);
        }

        [TestMethod]
        public void ImportFromPresentation_ShouldAddObjectiveToCourse()
        {
            //Arrange
            var file = Substitute.For<HttpPostedFileBase>();
            file.FileName.Returns("fileName");
            file.ContentLength.Returns(1);

            _configurationReader.CourseImportConfiguration.Returns(new CourseImportConfigurationSection() { PresentationMaximumFileSize = 1 });

            _mapper.Map(Arg.Any<Stream>()).Returns(Substitute.For<Presentation>());

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);

            var objective = Substitute.For<Objective>();
            _entityFactory.Objective(Arg.Any<string>(), Arg.Any<string>()).Returns(objective);

            //Act
            _controller.ImportFromPresentation(file);

            //Assert
            course.Received().RelateObjective(objective, Arg.Any<int?>(), Arg.Any<string>());
        }

        [TestMethod]
        public void ImportFromPresentation_ShouldAddContentToObjective()
        {
            //Arrange
            var file = Substitute.For<HttpPostedFileBase>();
            file.FileName.Returns("fileName");
            file.ContentLength.Returns(1);

            _configurationReader.CourseImportConfiguration.Returns(new CourseImportConfigurationSection() { PresentationMaximumFileSize = 1 });

            var presentation = new Presentation();
            presentation.Slides.Add(new Slide());
            _mapper.Map(Arg.Any<Stream>()).Returns(presentation);

            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(Substitute.For<Course>());

            var objective = Substitute.For<Objective>();
            _entityFactory.Objective(Arg.Any<string>(), Arg.Any<string>()).Returns(objective);

            var content = Substitute.For<InformationContent>();
            _entityFactory.InformationContent(Arg.Any<string>(), Arg.Any<string>()).Returns(content);

            //Act
            _controller.ImportFromPresentation(file);

            //Assert
            objective.Received().AddQuestion(content, Arg.Any<string>());
        }

        [TestMethod]
        public void ImportFromPresentation_ShouldNotAddLearningContentToContent_WhenSlideIsEmpty()
        {
            //Arrange
            var file = Substitute.For<HttpPostedFileBase>();
            file.FileName.Returns("fileName");
            file.ContentLength.Returns(1);

            _configurationReader.CourseImportConfiguration.Returns(new CourseImportConfigurationSection() { PresentationMaximumFileSize = 1 });

            var presentation = new Presentation();
            presentation.Slides.Add(new Slide());
            _mapper.Map(Arg.Any<Stream>()).Returns(presentation);

            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(Substitute.For<Course>());
            _entityFactory.Objective(Arg.Any<string>(), Arg.Any<string>()).Returns(Substitute.For<Objective>());

            var informationContent = Substitute.For<InformationContent>();
            _entityFactory.InformationContent(Arg.Any<string>(), Arg.Any<string>()).Returns(informationContent);

            //Act
            _controller.ImportFromPresentation(file);

            //Assert
            informationContent.DidNotReceive().AddLearningContent(Arg.Any<LearningContent>(), Arg.Any<string>());
        }

        [TestMethod]
        public void ImportFromPresentation_ShouldAddLearningContentToContent()
        {
            //Arrange
            var file = Substitute.For<HttpPostedFileBase>();
            file.FileName.Returns("fileName");
            file.ContentLength.Returns(1);

            _configurationReader.CourseImportConfiguration.Returns(new CourseImportConfigurationSection() { PresentationMaximumFileSize = 1 });

            var presentation = new Presentation();
            var slide = new Slide();
            slide.AddShape(new Shape("content", new Position(0, 0)));

            presentation.Slides.Add(slide);
            _mapper.Map(Arg.Any<Stream>()).Returns(presentation);

            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(Substitute.For<Course>());
            _entityFactory.Objective(Arg.Any<string>(), Arg.Any<string>()).Returns(Substitute.For<Objective>());

            var informationContent = Substitute.For<InformationContent>();
            _entityFactory.InformationContent(Arg.Any<string>(), Arg.Any<string>()).Returns(informationContent);

            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(Arg.Any<string>(), Arg.Any<string>()).Returns(learningContent);

            //Act
            _controller.ImportFromPresentation(file);

            //Assert
            informationContent.Received().AddLearningContent(learningContent, Arg.Any<string>());
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

            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(Substitute.For<Course>());
            _entityFactory.Objective(Arg.Any<string>(), Arg.Any<string>()).Returns(Substitute.For<Objective>());

            //Act
            var result = _controller.ImportFromPresentation(file);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

    }
}
