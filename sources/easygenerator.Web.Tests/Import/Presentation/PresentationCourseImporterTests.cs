using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Import.Presentation;
using easygenerator.Web.Import.Presentation.HtmlComposers;
using easygenerator.Web.Import.Presentation.Model;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Import.Presentation
{
    [TestClass]
    public class PresentationCourseImporterTests
    {
        private IEntityFactory _entityFactory;
        private ITemplateRepository _templateRepository;
        private ISlideHtmlComposer _slideHtmlComposer;

        private readonly string FileName = "fileName";
        private readonly string Username = "username";

        private PresentationCourseImporter _importer;

        [TestInitialize]
        public void Initialize()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _templateRepository = Substitute.For<ITemplateRepository>();
            _slideHtmlComposer = Substitute.For<ISlideHtmlComposer>();

            _importer = new PresentationCourseImporter(_entityFactory, _templateRepository, _slideHtmlComposer);
        }

        [TestMethod]
        public void Import_ShouldAddSectionToCourse()
        {
            //Arrange
            var presentation = Substitute.For<easygenerator.Web.Import.Presentation.Model.Presentation>();

            var course = Substitute.For<Course>();
            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(course);

            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);

            //Act
            _importer.Import(presentation, FileName, Username);

            //Assert
            course.Received().RelateSection(section, Arg.Any<int?>(), Arg.Any<string>());
        }

        [TestMethod]
        public void Import_ShouldAddContentToSection()
        {
            //Arrange
            var presentation = Substitute.For<easygenerator.Web.Import.Presentation.Model.Presentation>();
            presentation.Slides.Add(new Slide());

            _entityFactory.Course(Arg.Any<string>(), Arg.Any<easygenerator.DomainModel.Entities.Template>(), Arg.Any<string>()).Returns(Substitute.For<Course>());

            var section = Substitute.For<Section>();
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(section);

            var content = Substitute.For<InformationContent>();
            _entityFactory.InformationContent(Arg.Any<string>(), Arg.Any<string>()).Returns(content);

            //Act
            _importer.Import(presentation, FileName, Username);

            //Assert
            section.Received().AddQuestion(content, Arg.Any<string>());
        }

        [TestMethod]
        public void Import_ShouldNotAddLearningContentToContent_WhenSlideIsEmpty()
        {
            //Arrange
            var presentation = Substitute.For<easygenerator.Web.Import.Presentation.Model.Presentation>();
            presentation.Slides.Add(new Slide());

            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(Substitute.For<Course>());
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(Substitute.For<Section>());

            var informationContent = Substitute.For<InformationContent>();
            _entityFactory.InformationContent(Arg.Any<string>(), Arg.Any<string>()).Returns(informationContent);

            //Act
            _importer.Import(presentation, FileName, Username);

            //Assert
            informationContent.DidNotReceive().AddLearningContent(Arg.Any<LearningContent>(), Arg.Any<string>());
        }

        [TestMethod]
        public void Import_ShouldAddLearningContentToContent()
        {
            //Arrange
            var presentation = Substitute.For<easygenerator.Web.Import.Presentation.Model.Presentation>();
            var slide = Substitute.For<Slide>();
            presentation.Slides.Add(slide);
            _slideHtmlComposer.ComposeHtml(slide).Returns("html");

            _entityFactory.Course(Arg.Any<string>(), Arg.Any<Template>(), Arg.Any<string>()).Returns(Substitute.For<Course>());
            _entityFactory.Section(Arg.Any<string>(), Arg.Any<string>()).Returns(Substitute.For<Section>());

            var informationContent = Substitute.For<InformationContent>();
            _entityFactory.InformationContent(Arg.Any<string>(), Arg.Any<string>()).Returns(informationContent);

            var learningContent = Substitute.For<LearningContent>();
            _entityFactory.LearningContent(Arg.Any<string>(), Arg.Any<string>()).Returns(learningContent);

            //Act
            _importer.Import(presentation, FileName, Username);

            //Assert
            informationContent.Received().AddLearningContent(learningContent, Arg.Any<string>());
        }
    }
}
