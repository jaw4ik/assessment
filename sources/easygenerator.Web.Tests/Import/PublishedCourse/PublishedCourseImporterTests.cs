using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel;
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
        private FileCache _fileCache;
        private CourseEntityReader _courseEntityReader;
        private ObjectiveEntityReader _objectiveEntityReader;
        private QuestionEntityReader _questionEntityReader;
        private AnswerEntityReader _answerEntityReader;
        private LearningContentEntityReader _learningContentEntityReader;
        private PublishedCourseStructureReader _courseStructureReader;

        [TestInitialize]
        public void InitializeContext()
        {
            _physicalFileManager = Substitute.For<PhysicalFileManager>();
            _entityFactory = Substitute.For<IEntityFactory>();

            _templateRepository = Substitute.For<ITemplateRepository>();
            _templateRepository.GetDefaultTemplate().Returns(TemplateObjectMother.Create());

            _fileCache = Substitute.For<FileCache>(_physicalFileManager);

            _courseEntityReader = Substitute.For<CourseEntityReader>(_fileCache, _entityFactory, _templateRepository);
            _objectiveEntityReader = Substitute.For<ObjectiveEntityReader>(_entityFactory);
            _courseStructureReader = Substitute.For<PublishedCourseStructureReader>();
            _questionEntityReader = Substitute.For<QuestionEntityReader>(_fileCache, _entityFactory);
            _answerEntityReader = Substitute.For<AnswerEntityReader>(_entityFactory);
            _learningContentEntityReader = Substitute.For<LearningContentEntityReader>(_fileCache, _entityFactory);

            _importer = new PublishedCourseImporter(_physicalFileManager,
                _fileCache, 
                _courseStructureReader,
                _courseEntityReader,
                _objectiveEntityReader,
                _questionEntityReader,
                _answerEntityReader, 
                _learningContentEntityReader);

            _fileCache.ReadFromCacheOrLoad(Arg.Any<string>()).Returns("{}");
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
            _fileCache.Received().ReadFromCacheOrLoad(courseDataFilePath);

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
            _courseStructureReader.GetQuestions(objectiveId, Arg.Any<JObject>())
                .Returns(new List<Guid>());
            _courseEntityReader.ReadCourse(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(CourseObjectMother.Create());
            _objectiveEntityReader.ReadObjective(objectiveId, CreatedBy, Arg.Any<JObject>())
                .Returns(ObjectiveObjectMother.Create(objectiveTitle, CreatedBy));

            //Act
            var course = _importer.Import(publicationPath, CreatedBy);

            //Assert
            course.RelatedObjectives.Count().Should().Be(1);
            course.RelatedObjectives.ElementAt(0).Title.Should().Be(objectiveTitle);
            course.RelatedObjectives.ElementAt(0).CreatedBy.Should().Be(CreatedBy);
        }

        [TestMethod]
        public void Import_ShouldCreateCourseWithSpecifiedQuestions()
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

            var question = QuestionObjectMother.Create(questionTitle, CreatedBy);
            question.UpdateContent(questionContent, CreatedBy);

            _courseStructureReader.GetQuestions(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Guid>() { questionId });
            _questionEntityReader.ReadQuestion(questionId, publicationPath, CreatedBy, Arg.Any<JObject>())
                .Returns(question);

            //Act
            var course = _importer.Import(publicationPath, CreatedBy);

            //Assert
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).Title.Should().Be(questionTitle);
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).Content.Should().Be(questionContent);
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).CreatedBy.Should().Be(CreatedBy);
        }

        [TestMethod]
        public void Import_ShouldCreateCourseWithSpecifiedAnswers()
        {
            //Arrange
            string publicationPath = @"SomePathToDirectory";

            _physicalFileManager.DirectoryExists(publicationPath)
                .Returns(true);
            _courseStructureReader.GetObjectives(Arg.Any<JObject>())
                .Returns(new List<Guid>() { Guid.NewGuid() });
            _courseStructureReader.GetQuestions(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Guid>() { Guid.NewGuid() });
            _courseEntityReader.ReadCourse(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(CourseObjectMother.Create());
            _objectiveEntityReader.ReadObjective(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(ObjectiveObjectMother.Create());


            var answerId = Guid.NewGuid();
            var answerText = "Some answer text";
            var answerCorrectness = true;

            _courseStructureReader.GetAnswers(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Guid>() { answerId });

            _questionEntityReader.ReadQuestion(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(QuestionObjectMother.Create());
            _answerEntityReader.ReadAnswer(answerId, CreatedBy, Arg.Any<JObject>())
                .Returns(AnswerObjectMother.Create(answerText, answerCorrectness, CreatedBy));

            //Act
            var course = _importer.Import(publicationPath, CreatedBy);

            //Assert
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).Answers.ElementAt(0).Text.Should().Be(answerText);
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).Answers.ElementAt(0).IsCorrect.Should().Be(answerCorrectness);
            course.RelatedObjectives.ElementAt(0).Questions.ElementAt(0).Answers.ElementAt(0).CreatedBy.Should().Be(CreatedBy);
        }

        [TestMethod]
        public void Import_ShouldCreateCourseWithSpecifiedLearningContents()
        {
            //Arrange
            string publicationPath = @"SomePathToDirectory";

            _physicalFileManager.DirectoryExists(publicationPath)
                .Returns(true);

            _courseStructureReader.GetObjectives(Arg.Any<JObject>())
                .Returns(new List<Guid>() { Guid.NewGuid() });
            _courseStructureReader.GetQuestions(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Guid>() { Guid.NewGuid() });
            _courseEntityReader.ReadCourse(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(CourseObjectMother.Create());
            _objectiveEntityReader.ReadObjective(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(ObjectiveObjectMother.Create());

            var learningContentId = Guid.NewGuid();
            var learningContentText = "Some learning content text";

            _courseStructureReader.GetLearningContents(Arg.Any<Guid>(), Arg.Any<JObject>())
                .Returns(new List<Guid>() { learningContentId });

            _questionEntityReader.ReadQuestion(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<JObject>())
                .Returns(QuestionObjectMother.Create());
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
