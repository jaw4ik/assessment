using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Import.PublishedCourse;
using easygenerator.Web.Import.PublishedCourse.EntityReaders;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json.Linq;
using NSubstitute;
using System;
using System.IO;

namespace easygenerator.Web.Tests.Import.PublishedCourse
{
    [TestClass]
    public class PublishedCourseImporterTests
    {
        private const string CreatedBy = "test@easygenerator.com";

        private PublishedCourseImporter _importer;

        private PhysicalFileManager _physicalFileManager;
        private IEntityFactory _entityFactory;
        private ITemplateRepository _templateRepository;
        private CourseEntityReader _courseEntityReader;
        private ObjectiveEntityReader _objectiveEntityReader;
        private QuestionEntityReader _questionEntityReader;
        private AnswerEntityReader _answerEntityReader;
        private LearningContentEntityReader _learningContentEntityReader;
        private PublishedCourseStructureReader _courseStructureReader;
        private ImportContentReader _importContentReader;

        [TestInitialize]
        public void InitializeContext()
        {
            _physicalFileManager = Substitute.For<PhysicalFileManager>();
            _entityFactory = Substitute.For<IEntityFactory>();

            _templateRepository = Substitute.For<ITemplateRepository>();
            _templateRepository.GetDefaultTemplate().Returns(TemplateObjectMother.Create());
            _importContentReader = Substitute.For<ImportContentReader>(_physicalFileManager);

            _courseEntityReader = Substitute.For<CourseEntityReader>(_importContentReader, _entityFactory, _templateRepository);
            _objectiveEntityReader = Substitute.For<ObjectiveEntityReader>(_entityFactory);
            _courseStructureReader = Substitute.For<PublishedCourseStructureReader>();
            _questionEntityReader = Substitute.For<QuestionEntityReader>(_importContentReader, _entityFactory);
            _answerEntityReader = Substitute.For<AnswerEntityReader>(_entityFactory);
            _learningContentEntityReader = Substitute.For<LearningContentEntityReader>(_importContentReader, _entityFactory);

            _importer = new PublishedCourseImporter(_physicalFileManager,
                _importContentReader,
                _courseStructureReader,
                _courseEntityReader,
                _objectiveEntityReader,
                _questionEntityReader,
                _answerEntityReader,
                _learningContentEntityReader);

            _importContentReader.ReadContent(Arg.Any<string>()).Returns("{ }");
        }

        #region Import

        [TestMethod]
        public void Import_ShouldThrowArgumentException_WhenPublishedCourseDirectoryNotFound()
        {
            //Arrange
            string publicationPath = @"SomePathToDirectory";
            _physicalFileManager.DirectoryExists(publicationPath)
                .Returns(false);

            //Act
            Action action = () => _importer.Import(publicationPath, CreatedBy);

            //Assert
            action.ShouldThrow<ArgumentException>().And.Message.Should().Be("Published package not found");
        }

        [TestMethod]
        public void Import_ShouldCreateCourseWithSpecifiedData()
        {
            //Arrange
            string publicationPath = @"SomePathToDirectory";
            var courseDataFilePath = Path.Combine(publicationPath, "content", "data.js");
            var courseTitle = "Some title";
            var courseIntroduction = "Some introductionContent";

            var courseEntity = CourseObjectMother.Create(courseTitle, CreatedBy);
            courseEntity.UpdateIntroductionContent(courseIntroduction, CreatedBy);

            _physicalFileManager.DirectoryExists(publicationPath)
                .Returns(true);
            _courseEntityReader.ReadCourse(publicationPath, CreatedBy, Arg.Any<JObject>())
                            .Returns(courseEntity);
            _courseStructureReader.GetObjectives(Arg.Any<JObject>()).Returns(new List<Guid>());

            //Act
            var course = _importer.Import(publicationPath, CreatedBy);

            //Assert
            _importContentReader.Received().ReadContent(courseDataFilePath);

            course.Title.Should().Be(courseTitle);
            course.IntroductionContent.Should().Be(courseIntroduction);
            course.CreatedBy.Should().Be(CreatedBy);
        }

        [TestMethod]
        public void Import_ShouldCreateCourseWithSpecifiedObjectives()
        {
            //Arrange
            string publicationPath = @"SomePathToDirectory";

            _physicalFileManager.DirectoryExists(publicationPath)
                .Returns(true);

            var objectiveId = Guid.NewGuid();
            var objectiveTitle = "Some objectiveTitle";

            _courseStructureReader.GetObjectives(Arg.Any<JObject>())
                .Returns(new List<Guid>() { objectiveId });
            _courseStructureReader.GetQuestionTypes(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Tuple<Guid, string>>() { new Tuple<Guid, string>(Guid.NewGuid(), Question.QuestionTypes.MultipleSelect) });
            _courseEntityReader.ReadCourse(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(CourseObjectMother.Create());
            _objectiveEntityReader.ReadObjective(objectiveId, CreatedBy, Arg.Any<JObject>())
                .Returns(ObjectiveObjectMother.Create(objectiveTitle, CreatedBy));
            _questionEntityReader.ReadMultipleSelectQuestion(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(MultipleselectObjectMother.Create());

            //Act
            var course = _importer.Import(publicationPath, CreatedBy);

            //Assert
            course.RelatedObjectives.Count().Should().Be(1);
            course.RelatedObjectives.ElementAt(0).Title.Should().Be(objectiveTitle);
            course.RelatedObjectives.ElementAt(0).CreatedBy.Should().Be(CreatedBy);
        }

        [TestMethod]
        public void Import_ShouldCreateCourseWithSpecifiedMultipleSelectQuestions()
        {
            //Arrange
            string publicationPath = @"SomePathToDirectory";

            _physicalFileManager.DirectoryExists(publicationPath)
                .Returns(true);
            _courseStructureReader.GetObjectives(Arg.Any<JObject>())
                .Returns(new List<Guid>() { Guid.NewGuid() });
            _objectiveEntityReader.ReadObjective(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(ObjectiveObjectMother.Create());
            _courseEntityReader.ReadCourse(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(CourseObjectMother.Create());

            var questionId = Guid.NewGuid();
            var questionTitle = "Some question title";
            var questionContent = "Some question content";

            var question = MultipleselectObjectMother.Create(questionTitle, CreatedBy);
            question.UpdateContent(questionContent, CreatedBy);

            _courseStructureReader.GetQuestionTypes(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Tuple<Guid, string>>() { new Tuple<Guid, string>(questionId, Question.QuestionTypes.MultipleSelect) });
            _questionEntityReader.ReadMultipleSelectQuestion(questionId, publicationPath, CreatedBy, Arg.Any<JObject>())
                .Returns(question);

            //Act
            var course = _importer.Import(publicationPath, CreatedBy);

            //Assert
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).Title.Should().Be(questionTitle);
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).Content.Should().Be(questionContent);
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).CreatedBy.Should().Be(CreatedBy);
        }

        [TestMethod]
        public void Import_ShouldCreateCourseWithSpecifiedFillInTheBlanksQuestions()
        {
            //Arrange
            string publicationPath = @"SomePathToDirectory";

            _physicalFileManager.DirectoryExists(publicationPath)
                .Returns(true);
            _courseStructureReader.GetObjectives(Arg.Any<JObject>())
                .Returns(new List<Guid>() { Guid.NewGuid() });
            _objectiveEntityReader.ReadObjective(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(ObjectiveObjectMother.Create());
            _courseEntityReader.ReadCourse(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(CourseObjectMother.Create());

            var questionId = Guid.NewGuid();
            var questionTitle = "Some question title";
            var questionContent = "Some question content";

            var question = FillInTheBlanksObjectMother.Create(questionTitle, CreatedBy);
            question.UpdateContent(questionContent, CreatedBy);

            _courseStructureReader.GetQuestionTypes(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Tuple<Guid, string>>() { new Tuple<Guid, string>(questionId, Question.QuestionTypes.FillInTheBlanks) });
            _questionEntityReader.ReadFillInTheBlanksQuestion(questionId, publicationPath, CreatedBy, Arg.Any<JObject>())
                .Returns(question);

            //Act
            var course = _importer.Import(publicationPath, CreatedBy);

            //Assert
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).Title.Should().Be(questionTitle);
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).Content.Should().Be(questionContent);
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).CreatedBy.Should().Be(CreatedBy);
        }

        [TestMethod]
        public void Import_ShouldCreateCourseWithSpecifiedDragAndDropTextQuestions()
        {
            //Arrange
            string publicationPath = @"SomePathToDirectory";

            _physicalFileManager.DirectoryExists(publicationPath)
                .Returns(true);
            _courseStructureReader.GetObjectives(Arg.Any<JObject>())
                .Returns(new List<Guid>() { Guid.NewGuid() });
            _objectiveEntityReader.ReadObjective(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(ObjectiveObjectMother.Create());
            _courseEntityReader.ReadCourse(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(CourseObjectMother.Create());

            var questionId = Guid.NewGuid();
            var questionTitle = "Some question title";
            var questionContent = "Some question content";

            var question = DragAndDropTextObjectMother.Create(questionTitle, CreatedBy);
            question.UpdateContent(questionContent, CreatedBy);

            _courseStructureReader.GetQuestionTypes(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Tuple<Guid, string>>() { new Tuple<Guid, string>(questionId, Question.QuestionTypes.DragAndDropText) });
            _questionEntityReader.ReadDragAndDropTextQuestion(questionId, publicationPath, CreatedBy, Arg.Any<JObject>())
                .Returns(question);

            //Act
            var course = _importer.Import(publicationPath, CreatedBy);

            //Assert
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).Title.Should().Be(questionTitle);
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).Content.Should().Be(questionContent);
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).CreatedBy.Should().Be(CreatedBy);
        }

        [TestMethod]
        public void Import_ShouldCreateCourseWithSpecifiedSingleSelectQuestions()
        {
            //Arrange
            string publicationPath = @"SomePathToDirectory";

            _physicalFileManager.DirectoryExists(publicationPath)
                .Returns(true);
            _courseStructureReader.GetObjectives(Arg.Any<JObject>())
                .Returns(new List<Guid>() { Guid.NewGuid() });
            _objectiveEntityReader.ReadObjective(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(ObjectiveObjectMother.Create());
            _courseEntityReader.ReadCourse(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(CourseObjectMother.Create());

            var questionId = Guid.NewGuid();
            var questionTitle = "Some question title";
            var questionContent = "Some question content";

            var question = SingleSelectTextObjectMother.Create(questionTitle, CreatedBy);
            question.UpdateContent(questionContent, CreatedBy);

            _courseStructureReader.GetQuestionTypes(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Tuple<Guid, string>>() { new Tuple<Guid, string>(questionId, Question.QuestionTypes.SingleSelectText) });
            _questionEntityReader.ReadSingleSelectTextQuestion(questionId, publicationPath, CreatedBy, Arg.Any<JObject>())
                .Returns(question);

            //Act
            var course = _importer.Import(publicationPath, CreatedBy);

            //Assert
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).Title.Should().Be(questionTitle);
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).Content.Should().Be(questionContent);
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).CreatedBy.Should().Be(CreatedBy);
        }

        [TestMethod]
        public void Import_ShouldThrowException_WhenQuestionTypeIsNotSupported()
        {
            //Arrange
            string publicationPath = @"SomePathToDirectory";

            _physicalFileManager.DirectoryExists(publicationPath)
                .Returns(true);
            _courseStructureReader.GetObjectives(Arg.Any<JObject>())
                .Returns(new List<Guid>() { Guid.NewGuid() });
            _objectiveEntityReader.ReadObjective(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(ObjectiveObjectMother.Create());
            _courseEntityReader.ReadCourse(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(CourseObjectMother.Create());

            var questionId = Guid.NewGuid();
            var questionTitle = "Some question title";
            var questionContent = "Some question content";

            var question = SingleSelectTextObjectMother.Create(questionTitle, CreatedBy);
            question.UpdateContent(questionContent, CreatedBy);

            _courseStructureReader.GetQuestionTypes(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Tuple<Guid, string>>() { new Tuple<Guid, string>(questionId, "not existing id") });
            _questionEntityReader.ReadSingleSelectTextQuestion(questionId, publicationPath, CreatedBy, Arg.Any<JObject>())
                .Returns(question);

            //Act
            Action action = () => _importer.Import(publicationPath, CreatedBy);

            //Assert
            action.ShouldThrow<Exception>().And.Message.Should().Be("Unsupported question type");
        }

        [TestMethod]
        public void Import_ShouldCreateMultipleSelectQuestionWithSpecifiedAnswers()
        {
            //Arrange
            string publicationPath = @"SomePathToDirectory";

            _physicalFileManager.DirectoryExists(publicationPath)
                .Returns(true);
            _courseStructureReader.GetObjectives(Arg.Any<JObject>())
                .Returns(new List<Guid>() { Guid.NewGuid() });
            _courseStructureReader.GetQuestionTypes(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Tuple<Guid, string>>() { new Tuple<Guid, string>(Guid.NewGuid(), Question.QuestionTypes.MultipleSelect) });
            _courseEntityReader.ReadCourse(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(CourseObjectMother.Create());
            _objectiveEntityReader.ReadObjective(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(ObjectiveObjectMother.Create());


            var answerId = Guid.NewGuid();
            var answerText = "Some answer text";
            var answerCorrectness = true;

            _courseStructureReader.GetAnswers(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Guid>() { answerId });

            _questionEntityReader.ReadMultipleSelectQuestion(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(MultipleselectObjectMother.Create());
            _answerEntityReader.ReadAnswer(answerId, CreatedBy, Arg.Any<JObject>())
                .Returns(AnswerObjectMother.Create(answerText, answerCorrectness, CreatedBy));

            //Act
            var course = _importer.Import(publicationPath, CreatedBy);

            //Assert
            var objective = course.RelatedObjectives.ElementAt(0);
            var question = (Multipleselect)objective.Questions.ElementAt(0);
            question.Answers.ElementAt(0).Text.Should().Be(answerText);
            question.Answers.ElementAt(0).IsCorrect.Should().Be(answerCorrectness);
            question.Answers.ElementAt(0).CreatedBy.Should().Be(CreatedBy);
            _answerEntityReader.Received().ReadAnswer(answerId, CreatedBy, Arg.Any<JObject>());
        }


        [TestMethod]
        public void Import_ShouldCreateFillInTheBlanksQuestionWithSpecifiedAnswers()
        {
            //Arrange
            string publicationPath = @"SomePathToDirectory";

            _physicalFileManager.DirectoryExists(publicationPath)
                .Returns(true);
            _courseStructureReader.GetObjectives(Arg.Any<JObject>())
                .Returns(new List<Guid>() { Guid.NewGuid() });
            _courseStructureReader.GetQuestionTypes(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Tuple<Guid, string>>() { new Tuple<Guid, string>(Guid.NewGuid(), Question.QuestionTypes.FillInTheBlanks) });
            _courseEntityReader.ReadCourse(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(CourseObjectMother.Create());
            _objectiveEntityReader.ReadObjective(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(ObjectiveObjectMother.Create());


            var answerId = Guid.NewGuid();
            var answerText = "Some answer text";
            var answerCorrectness = true; var answerGroup = default(Guid);

            _courseStructureReader.GetAnswers(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Guid>() { answerId });

            _questionEntityReader.ReadFillInTheBlanksQuestion(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(FillInTheBlanksObjectMother.Create());
            _answerEntityReader.ReadBlankAnswer(answerId, CreatedBy, Arg.Any<JObject>())
                .Returns(BlankAnswerObjectMother.Create(answerText, answerCorrectness, answerGroup, CreatedBy));

            //Act
            var course = _importer.Import(publicationPath, CreatedBy);

            //Assert
            var objective = course.RelatedObjectives.ElementAt(0);
            var question = (FillInTheBlanks)objective.Questions.ElementAt(0);
            question.Answers.ElementAt(0).Text.Should().Be(answerText);
            question.Answers.ElementAt(0).IsCorrect.Should().Be(answerCorrectness);
            question.Answers.ElementAt(0).CreatedBy.Should().Be(CreatedBy);
            _answerEntityReader.Received().ReadBlankAnswer(answerId, CreatedBy, Arg.Any<JObject>());
        }

        [TestMethod]
        public void Import_ShouldCreateDragAndDropTextQuestionWithSpecifiedDropspots()
        {
            //Arrange
            string publicationPath = @"SomePathToDirectory";

            var background = "Some background";
            var answerText = "Some answer text";
            var x = 1;
            var y = 2;

            var createdQuestion = DragAndDropTextObjectMother.Create();
            createdQuestion.ChangeBackground(background, CreatedBy);
            var dropspot = DropspotObjectMother.Create(answerText, x, y, CreatedBy);

            _physicalFileManager.DirectoryExists(publicationPath)
                .Returns(true);
            _courseStructureReader.GetObjectives(Arg.Any<JObject>())
                .Returns(new List<Guid>() { Guid.NewGuid() });
            _courseStructureReader.GetQuestionTypes(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Tuple<Guid, string>>() { new Tuple<Guid, string>(Guid.NewGuid(), Question.QuestionTypes.DragAndDropText) });
            _courseStructureReader.GetDropspots(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Guid>() { dropspot.Id });
            _courseEntityReader.ReadCourse(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(CourseObjectMother.Create());
            _objectiveEntityReader.ReadObjective(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(ObjectiveObjectMother.Create());

            _questionEntityReader.ReadDragAndDropTextQuestion(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(createdQuestion);
            _answerEntityReader.ReadDropspot(dropspot.Id, CreatedBy, Arg.Any<JObject>())
                .Returns(dropspot);

            //Act
            var course = _importer.Import(publicationPath, CreatedBy);

            //Assert
            var objective = course.RelatedObjectives.ElementAt(0);
            var question = (DragAndDropText)objective.Questions.ElementAt(0);
            question.Background.Should().Be(background);
            question.Dropspots.ElementAt(0).Text.Should().Be(answerText);
            question.Dropspots.ElementAt(0).X.Should().Be(x);
            question.Dropspots.ElementAt(0).Y.Should().Be(y);
            question.Dropspots.ElementAt(0).CreatedBy.Should().Be(CreatedBy);
            _answerEntityReader.Received().ReadDropspot(dropspot.Id, CreatedBy, Arg.Any<JObject>());
        }

        [TestMethod]
        public void Import_ShouldCreateSingleSelectTextQuestionWithSpecifiedAnswers()
        {
            //Arrange
            string publicationPath = @"SomePathToDirectory";

            _physicalFileManager.DirectoryExists(publicationPath)
                .Returns(true);
            _courseStructureReader.GetObjectives(Arg.Any<JObject>())
                .Returns(new List<Guid>() { Guid.NewGuid() });
            _courseStructureReader.GetQuestionTypes(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Tuple<Guid, string>>() { new Tuple<Guid, string>(Guid.NewGuid(), Question.QuestionTypes.SingleSelectText) });
            _courseEntityReader.ReadCourse(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(CourseObjectMother.Create());
            _objectiveEntityReader.ReadObjective(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(ObjectiveObjectMother.Create());


            var answerId = Guid.NewGuid();
            var answerText = "Some answer text";
            var answerCorrectness = true;

            _courseStructureReader.GetAnswers(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Guid>() { answerId });

            _questionEntityReader.ReadSingleSelectTextQuestion(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(SingleSelectTextObjectMother.Create());
            _answerEntityReader.ReadAnswer(answerId, CreatedBy, Arg.Any<JObject>())
                .Returns(AnswerObjectMother.Create(answerText, answerCorrectness, CreatedBy));

            //Act
            var course = _importer.Import(publicationPath, CreatedBy);

            //Assert
            var objective = course.RelatedObjectives.ElementAt(0);
            var question = (SingleSelectText)objective.Questions.ElementAt(0);
            question.Answers.ElementAt(0).Text.Should().Be(answerText);
            question.Answers.ElementAt(0).IsCorrect.Should().Be(answerCorrectness);
            question.Answers.ElementAt(0).CreatedBy.Should().Be(CreatedBy);
            _answerEntityReader.Received().ReadAnswer(answerId, CreatedBy, Arg.Any<JObject>());
        }

        [TestMethod]
        public void Import_ShouldCreateMultipleSelectQuestionWithSpecifiedLearningContents()
        {
            //Arrange
            string publicationPath = @"SomePathToDirectory";

            _physicalFileManager.DirectoryExists(publicationPath)
                .Returns(true);

            _courseStructureReader.GetObjectives(Arg.Any<JObject>())
                .Returns(new List<Guid>() { Guid.NewGuid() });
            _courseStructureReader.GetQuestionTypes(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Tuple<Guid, string>>() { new Tuple<Guid, string>(Guid.NewGuid(), Question.QuestionTypes.MultipleSelect) });
            _courseEntityReader.ReadCourse(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(CourseObjectMother.Create());
            _objectiveEntityReader.ReadObjective(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(ObjectiveObjectMother.Create());

            var learningContentId = Guid.NewGuid();
            var learningContentText = "Some learning content text";

            _courseStructureReader.GetLearningContents(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Guid>() { learningContentId });

            _questionEntityReader.ReadMultipleSelectQuestion(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(MultipleselectObjectMother.Create());
            _learningContentEntityReader.ReadLearningContent(learningContentId, publicationPath, CreatedBy, Arg.Any<JObject>())
                .Returns(LearningContentObjectMother.Create(learningContentText, CreatedBy));

            //Act
            var course = _importer.Import(publicationPath, CreatedBy);

            //Assert
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).LearningContents.ElementAt(0).Text.Should().Be(learningContentText);
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).LearningContents.ElementAt(0).CreatedBy.Should().Be(CreatedBy);
        }

        [TestMethod]
        public void Import_ShouldCreateFillInTheBlanksQuestionWithSpecifiedLearningContents()
        {
            //Arrange
            string publicationPath = @"SomePathToDirectory";

            _physicalFileManager.DirectoryExists(publicationPath)
                .Returns(true);

            _courseStructureReader.GetObjectives(Arg.Any<JObject>())
                .Returns(new List<Guid>() { Guid.NewGuid() });
            _courseStructureReader.GetQuestionTypes(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Tuple<Guid, string>>() { new Tuple<Guid, string>(Guid.NewGuid(), Question.QuestionTypes.FillInTheBlanks) });
            _courseEntityReader.ReadCourse(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(CourseObjectMother.Create());
            _objectiveEntityReader.ReadObjective(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(ObjectiveObjectMother.Create());

            var learningContentId = Guid.NewGuid();
            var learningContentText = "Some learning content text";

            _courseStructureReader.GetLearningContents(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Guid>() { learningContentId });

            _questionEntityReader.ReadFillInTheBlanksQuestion(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(FillInTheBlanksObjectMother.Create());
            _learningContentEntityReader.ReadLearningContent(learningContentId, publicationPath, CreatedBy, Arg.Any<JObject>())
                .Returns(LearningContentObjectMother.Create(learningContentText, CreatedBy));

            //Act
            var course = _importer.Import(publicationPath, CreatedBy);

            //Assert
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).LearningContents.ElementAt(0).Text.Should().Be(learningContentText);
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).LearningContents.ElementAt(0).CreatedBy.Should().Be(CreatedBy);
        }


        [TestMethod]
        public void Import_ShouldCreateSingleSelectTextQuestionWithSpecifiedLearningContents()
        {
            //Arrange
            string publicationPath = @"SomePathToDirectory";

            _physicalFileManager.DirectoryExists(publicationPath)
                .Returns(true);

            _courseStructureReader.GetObjectives(Arg.Any<JObject>())
                .Returns(new List<Guid>() { Guid.NewGuid() });
            _courseStructureReader.GetQuestionTypes(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Tuple<Guid, string>>() { new Tuple<Guid, string>(Guid.NewGuid(), Question.QuestionTypes.SingleSelectText) });
            _courseEntityReader.ReadCourse(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(CourseObjectMother.Create());
            _objectiveEntityReader.ReadObjective(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(ObjectiveObjectMother.Create());

            var learningContentId = Guid.NewGuid();
            var learningContentText = "Some learning content text";

            _courseStructureReader.GetLearningContents(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Guid>() { learningContentId });

            _questionEntityReader.ReadSingleSelectTextQuestion(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(SingleSelectTextObjectMother.Create());
            _learningContentEntityReader.ReadLearningContent(learningContentId, publicationPath, CreatedBy, Arg.Any<JObject>())
                .Returns(LearningContentObjectMother.Create(learningContentText, CreatedBy));

            //Act
            var course = _importer.Import(publicationPath, CreatedBy);

            //Assert
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).LearningContents.ElementAt(0).Text.Should().Be(learningContentText);
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).LearningContents.ElementAt(0).CreatedBy.Should().Be(CreatedBy);
        }


        [TestMethod]
        public void Import_ShouldCreateDragAndDropTextQuestionWithSpecifiedLearningContents()
        {
            //Arrange
            string publicationPath = @"SomePathToDirectory";

            _physicalFileManager.DirectoryExists(publicationPath)
                .Returns(true);

            _courseStructureReader.GetObjectives(Arg.Any<JObject>())
                .Returns(new List<Guid>() { Guid.NewGuid() });
            _courseStructureReader.GetQuestionTypes(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Tuple<Guid, string>>() { new Tuple<Guid, string>(Guid.NewGuid(), Question.QuestionTypes.DragAndDropText) });
            _courseEntityReader.ReadCourse(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(CourseObjectMother.Create());
            _objectiveEntityReader.ReadObjective(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(ObjectiveObjectMother.Create());

            var learningContentId = Guid.NewGuid();
            var learningContentText = "Some learning content text";

            _courseStructureReader.GetLearningContents(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Guid>() { learningContentId });

            _questionEntityReader.ReadDragAndDropTextQuestion(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(DragAndDropTextObjectMother.Create());
            _learningContentEntityReader.ReadLearningContent(learningContentId, publicationPath, CreatedBy, Arg.Any<JObject>())
                .Returns(LearningContentObjectMother.Create(learningContentText, CreatedBy));

            //Act
            var course = _importer.Import(publicationPath, CreatedBy);

            //Assert
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).LearningContents.ElementAt(0).Text.Should().Be(learningContentText);
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).LearningContents.ElementAt(0).CreatedBy.Should().Be(CreatedBy);
        }

        #endregion

    }
}
