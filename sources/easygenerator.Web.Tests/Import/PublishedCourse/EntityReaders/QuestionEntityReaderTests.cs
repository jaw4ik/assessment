using System;
using System.IO;
using System.Linq;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Import.PublishedCourse;
using easygenerator.Web.Import.PublishedCourse.EntityReaders;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json.Linq;
using NSubstitute;

namespace easygenerator.Web.Tests.Import.PublishedCourse.EntityReaders
{
    [TestClass]
    public class QuestionEntityReaderTests
    {
        private QuestionEntityReader _questionEntityReader;
        private PhysicalFileManager _physicalFileManager;
        private ImportContentReader _importContentReader;
        private IEntityFactory _entityFactory;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();

            _entityFactory.MultipleselectQuestion(Arg.Any<string>(), Arg.Any<string>())
                .Returns(info => MultipleselectObjectMother.Create(info.Args().ElementAt(0).As<string>(), info.Args().ElementAt(1).As<string>()));
            _entityFactory.FillInTheBlanksQuestion(Arg.Any<string>(), Arg.Any<string>())
                .Returns(info => FillInTheBlanksObjectMother.Create(info.Args().ElementAt(0).As<string>(), info.Args().ElementAt(1).As<string>()));
            _entityFactory.SingleSelectTextQuestion(Arg.Any<string>(), Arg.Any<string>())
                .Returns(info => SingleSelectTextObjectMother.Create(info.Args().ElementAt(0).As<string>(), info.Args().ElementAt(1).As<string>()));
            _entityFactory.DragAndDropTextQuestion(Arg.Any<string>(), Arg.Any<string>())
                .Returns(info => DragAndDropTextObjectMother.Create(info.Args().ElementAt(0).As<string>(), info.Args().ElementAt(1).As<string>()));


            _physicalFileManager = Substitute.For<PhysicalFileManager>();
            _importContentReader = Substitute.For<ImportContentReader>(_physicalFileManager);
            _questionEntityReader = new QuestionEntityReader(_importContentReader, _entityFactory);
        }

        #region ReadMultipleSelectQuestion

        [TestMethod]
        public void ReadMultipleSelectQuestion_ShouldReadQuestionWithoutContentFromPublishedPackage_WhenQuestionHasNoContent()
        {
            //Arrange
            var pubisedPackagehPath = "SomePth";
            Guid questionId = Guid.NewGuid();
            string questionTitle = "Some objective title";
            string createdBy = "test@easygenerator.com";

            var courseData = JObject.Parse(
                String.Format("{{ objectives: [ {{ questions : [ {{ id: '{0}', title: '{1}', type: 0, hasContent: false }} ] }} ] }}",
                               questionId.ToString("N").ToLower(), questionTitle));

            //Act
            var question = _questionEntityReader.ReadMultipleSelectQuestion(questionId, pubisedPackagehPath, createdBy, courseData);

            //Assert
            question.Title.Should().Be(questionTitle);
            question.Content.Should().Be(String.Empty);
            question.CreatedBy.Should().Be(createdBy);

            _importContentReader.DidNotReceive().ReadContent(Arg.Any<string>());
        }

        [TestMethod]
        public void ReadMultipleSelectQuestion_ShouldReadQuestionWithContentFromPublishedPackage_WhenQuestionHasContent()
        {
            //Arrange
            var pubisedPackagehPath = "SomePth";
            Guid questionId = Guid.NewGuid();
            Guid objectiveId = Guid.NewGuid();
            string questionTitle = "Some objective title";
            string createdBy = "test@easygenerator.com";
            string questionContent = "ssfgdghkfasdfbsfgjghkarhdgh";

            var courseData = JObject.Parse(
                String.Format("{{ title: 'SomeCourseTitle', objectives: [" +
                                "{{ id: '{0}',  questions : [" +
                              "     {{ id: '{1}', title: '{2}', hasContent: true }}" +
                              "   ] }}" +
                              "] }}",
                               objectiveId.ToString("N").ToLower(), questionId.ToString("N").ToLower(), questionTitle));

            var contentPath = Path.Combine(pubisedPackagehPath, "content", objectiveId.ToString("N").ToLower(),
                questionId.ToString("N").ToLower(), "content.html");

            _importContentReader.ReadContent(contentPath).Returns(questionContent);

            //Act
            var question = _questionEntityReader.ReadMultipleSelectQuestion(questionId, pubisedPackagehPath, createdBy, courseData);

            //Assert
            question.Title.Should().Be(questionTitle);
            question.Content.Should().Be(questionContent);
            question.CreatedBy.Should().Be(createdBy);

            _importContentReader.Received().ReadContent(contentPath);
        }

        #endregion

        #region ReadFillInTheBlanksQuestion

        [TestMethod]
        public void ReadFillInTheBlanksQuestion_ShouldReadQuestionWithoutContentFromPublishedPackage_WhenQuestionHasNoContent()
        {
            //Arrange
            var pubisedPackagehPath = "SomePth";
            Guid questionId = Guid.NewGuid();
            string questionTitle = "Some objective title";
            string createdBy = "test@easygenerator.com";

            var courseData = JObject.Parse(
                String.Format("{{ objectives: [ {{ questions : [ {{ id: '{0}', title: '{1}', type: 1, hasContent: false }} ] }} ] }}",
                               questionId.ToString("N").ToLower(), questionTitle));

            //Act
            var question = _questionEntityReader.ReadFillInTheBlanksQuestion(questionId, pubisedPackagehPath, createdBy, courseData);

            //Assert
            question.Title.Should().Be(questionTitle);
            question.Content.Should().Be(String.Empty);
            question.CreatedBy.Should().Be(createdBy);

            _importContentReader.DidNotReceive().ReadContent(Arg.Any<string>());
        }

        [TestMethod]
        public void ReadFillInTheBlanksQuestion_ShouldReadQuestionWithContentFromPublishedPackage_WhenQuestionHasContent()
        {
            //Arrange
            var pubisedPackagehPath = "SomePth";
            Guid questionId = Guid.NewGuid();
            Guid objectiveId = Guid.NewGuid();
            string questionTitle = "Some objective title";
            string createdBy = "test@easygenerator.com";
            string questionContent = "ssfgdghkfasdfbsfgjghkarhdgh";

            var courseData = JObject.Parse(
                String.Format("{{ title: 'SomeCourseTitle', objectives: [" +
                                "{{ id: '{0}',  questions : [" +
                              "     {{ id: '{1}', title: '{2}', hasContent: true }}" +
                              "   ] }}" +
                              "] }}",
                               objectiveId.ToString("N").ToLower(), questionId.ToString("N").ToLower(), questionTitle));

            var contentPath = Path.Combine(pubisedPackagehPath, "content", objectiveId.ToString("N").ToLower(),
                questionId.ToString("N").ToLower(), "content.html");

            _importContentReader.ReadContent(contentPath).Returns(questionContent);

            //Act
            var question = _questionEntityReader.ReadFillInTheBlanksQuestion(questionId, pubisedPackagehPath, createdBy, courseData);

            //Assert
            question.Title.Should().Be(questionTitle);
            question.Content.Should().Be(questionContent);
            question.CreatedBy.Should().Be(createdBy);

            _importContentReader.Received().ReadContent(contentPath);
        }

        #endregion

        #region ReadSingleSelectTextQuestion

        [TestMethod]
        public void ReadSingleSelectTextQuestion_ShouldReadQuestionWithoutContentFromPublishedPackage_WhenQuestionHasNoContent()
        {
            //Arrange
            var pubisedPackagehPath = "SomePth";
            Guid questionId = Guid.NewGuid();
            string questionTitle = "Some objective title";
            string createdBy = "test@easygenerator.com";

            var courseData = JObject.Parse(
                String.Format("{{ objectives: [ {{ questions : [ {{ id: '{0}', title: '{1}', type: 3, hasContent: false }} ] }} ] }}",
                               questionId.ToString("N").ToLower(), questionTitle));

            //Act
            var question = _questionEntityReader.ReadSingleSelectTextQuestion(questionId, pubisedPackagehPath, createdBy, courseData);

            //Assert
            question.Title.Should().Be(questionTitle);
            question.Content.Should().Be(String.Empty);
            question.CreatedBy.Should().Be(createdBy);

            _importContentReader.DidNotReceive().ReadContent(Arg.Any<string>());
        }

        [TestMethod]
        public void ReadSingleSelectTextQuestion_ShouldReadQuestionWithContentFromPublishedPackage_WhenQuestionHasContent()
        {
            //Arrange
            var pubisedPackagehPath = "SomePth";
            Guid questionId = Guid.NewGuid();
            Guid objectiveId = Guid.NewGuid();
            string questionTitle = "Some objective title";
            string createdBy = "test@easygenerator.com";
            string questionContent = "ssfgdghkfasdfbsfgjghkarhdgh";

            var courseData = JObject.Parse(
                String.Format("{{ title: 'SomeCourseTitle', objectives: [" +
                                "{{ id: '{0}',  questions : [" +
                              "     {{ id: '{1}', title: '{2}', hasContent: true }}" +
                              "   ] }}" +
                              "] }}",
                               objectiveId.ToString("N").ToLower(), questionId.ToString("N").ToLower(), questionTitle));

            var contentPath = Path.Combine(pubisedPackagehPath, "content", objectiveId.ToString("N").ToLower(),
                questionId.ToString("N").ToLower(), "content.html");

            _importContentReader.ReadContent(contentPath).Returns(questionContent);

            //Act
            var question = _questionEntityReader.ReadSingleSelectTextQuestion(questionId, pubisedPackagehPath, createdBy, courseData);

            //Assert
            question.Title.Should().Be(questionTitle);
            question.Content.Should().Be(questionContent);
            question.CreatedBy.Should().Be(createdBy);

            _importContentReader.Received().ReadContent(contentPath);
        }

        #endregion

        #region ReadDragAndDropTextQuestion

        [TestMethod]
        public void ReadDragAndDropTextQuestion_ShouldReadQuestionWithoutContentFromPublishedPackage_WhenQuestionHasNoContent()
        {
            //Arrange
            var pubisedPackagehPath = "SomePth";
            Guid questionId = Guid.NewGuid();
            string questionTitle = "Some objective title";
            string createdBy = "test@easygenerator.com";
            string background = "Some background";

            var courseData = JObject.Parse(
                String.Format("{{ objectives: [ {{ questions : [ {{ id: '{0}', title: '{1}', type: 2, background: '{2}', hasContent: false }} ] }} ] }}",
                               questionId.ToString("N").ToLower(), questionTitle, background));

            //Act
            var question = _questionEntityReader.ReadDragAndDropTextQuestion(questionId, pubisedPackagehPath, createdBy, courseData);

            //Assert
            question.Title.Should().Be(questionTitle);
            question.Content.Should().Be(String.Empty);
            question.CreatedBy.Should().Be(createdBy);

            _importContentReader.DidNotReceive().ReadContent(Arg.Any<string>());
        }

        [TestMethod]
        public void ReadDragAndDropTextQuestion_ShouldReadQuestionWithContentFromPublishedPackage_WhenQuestionHasContent()
        {
            //Arrange
            var pubisedPackagehPath = "SomePth";
            Guid questionId = Guid.NewGuid();
            Guid objectiveId = Guid.NewGuid();
            string questionTitle = "Some objective title";
            string createdBy = "test@easygenerator.com";
            string questionContent = "ssfgdghkfasdfbsfgjghkarhdgh";
            string background = "Some background";

            var courseData = JObject.Parse(
                String.Format("{{ title: 'SomeCourseTitle', objectives: [" +
                                "{{ id: '{0}',  questions : [" +
                              "     {{ id: '{1}', title: '{2}', hasContent: true, type: 2, background: '{3}' }}" +
                              "   ] }}" +
                              "] }}",
                               objectiveId.ToString("N").ToLower(), questionId.ToString("N").ToLower(), questionTitle, background));

            var contentPath = Path.Combine(pubisedPackagehPath, "content", objectiveId.ToString("N").ToLower(),
                questionId.ToString("N").ToLower(), "content.html");

            _importContentReader.ReadContent(contentPath).Returns(questionContent);

            //Act
            var question = _questionEntityReader.ReadDragAndDropTextQuestion(questionId, pubisedPackagehPath, createdBy, courseData);

            //Assert
            question.Title.Should().Be(questionTitle);
            question.Content.Should().Be(questionContent);
            question.CreatedBy.Should().Be(createdBy);

            _importContentReader.Received().ReadContent(contentPath);
        }

        #endregion

    }
}
