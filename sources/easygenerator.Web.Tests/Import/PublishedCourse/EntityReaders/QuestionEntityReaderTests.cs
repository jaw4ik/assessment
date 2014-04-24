using System;
using System.IO;
using System.Linq;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
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
        private FileCache _fileCache;
        private PhysicalFileManager _physicalFileManager;
        private IEntityFactory _entityFactory;
        
        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();

            _entityFactory.Question(Arg.Any<string>(), Arg.Any<string>())
                .Returns(info =>
                    QuestionObjectMother.Create(info.Args().ElementAt(0).As<string>(),
                        info.Args().ElementAt(1).As<string>()));


            _physicalFileManager = Substitute.For<PhysicalFileManager>();
            _fileCache = Substitute.For<FileCache>(_physicalFileManager);
            _questionEntityReader = new QuestionEntityReader(_fileCache, _entityFactory);
        }

        #region ReadQuestion

        [TestMethod]
        public void ReqadQuestion_ShouldReadQuestionWithoutContentFromPublishedPackage_WhenQuestionHasNoContent()
        {
            //Arrange
            var pubisedPackagehPath = "SomePth";
            Guid questionId = Guid.NewGuid();
            string questionTitle = "Some objective title";
            string createdBy = "test@easygenerator.com";

            var courseData = JObject.Parse(
                String.Format("{{ objectives: [ {{ questions : [ {{ id: '{0}', title: '{1}', hasContent: false }} ] }} ] }}",
                               questionId.ToString("N").ToLower(), questionTitle));

            //Act
            var question = _questionEntityReader.ReadQuestion(questionId, pubisedPackagehPath, createdBy, courseData);

            //Assert
            question.Title.Should().Be(questionTitle);
            question.Content.Should().Be(String.Empty);
            question.CreatedBy.Should().Be(createdBy);

            _fileCache.DidNotReceive().ReadFromCacheOrLoad(Arg.Any<string>());
        }

        [TestMethod]
        public void ReqadQuestion_ShouldReadQuestionWithContentFromPublishedPackage_WhenQuestionHasContent()
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

            _fileCache.ReadFromCacheOrLoad(contentPath).Returns(questionContent);

            //Act
            var question = _questionEntityReader.ReadQuestion(questionId, pubisedPackagehPath, createdBy, courseData);

            //Assert
            question.Title.Should().Be(questionTitle);
            question.Content.Should().Be(questionContent);
            question.CreatedBy.Should().Be(createdBy);

            _fileCache.Received().ReadFromCacheOrLoad(contentPath);
        }

        #endregion

    }
}
