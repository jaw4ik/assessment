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
    public class LearningContentEntityReaderTests
    {
        private LearningContentEntityReader _learningContentEntityReader;
        private FileCache _fileCache;
        private PhysicalFileManager _physicalFileManager;
        private IEntityFactory _entityFactory;


        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();

            _entityFactory.LearningContent(Arg.Any<string>(), Arg.Any<string>())
                .Returns(info =>
                    LearningContentObjectMother.Create(info.Args().ElementAt(0).As<string>(),
                        info.Args().ElementAt(1).As<string>()));

            _physicalFileManager = Substitute.For<PhysicalFileManager>();
            _fileCache = Substitute.For<FileCache>(_physicalFileManager);
            _learningContentEntityReader = new LearningContentEntityReader(_fileCache, _entityFactory);
        }

        #region ReadLearningContent

        [TestMethod]
        public void ReadLearningContent_ShouldReadLearningContentFromPublishedPackage()
        {
            //Arrange
            var publishedPackagePath = "Some Path";
            Guid objectiveId = Guid.NewGuid();
            Guid questionId = Guid.NewGuid();
            Guid learningContentId = Guid.NewGuid();
            string learningContentText = "adsshdghhjxcvncnmm,uiouiop";
            string createdBy = "test@easygenerator.com";

            var courseData = JObject.Parse(
                String.Format("{{ objectives: [ {{ id: '{0}', questions: [ {{ id: '{1}', learningContents: [ {{ id: '{2}' }} ] }} ] }} ] }}",
                   objectiveId.ToString("N").ToLower(),
                   questionId.ToString("N").ToLower(),
                   learningContentId.ToString("N").ToLower()));

            var learningContentPath = Path.Combine(publishedPackagePath, "content", objectiveId.ToString("N").ToLower(),
                questionId.ToString("N").ToLower(), learningContentId.ToString("N").ToLower() + ".html");

            _fileCache.ReadFromCacheOrLoad(learningContentPath).Returns(learningContentText);

            //Act
            var learningContent = _learningContentEntityReader.ReadLearningContent(learningContentId, publishedPackagePath, createdBy, courseData);

            //Assert
            learningContent.Text.Should().Be(learningContentText);
            learningContent.CreatedBy.Should().Be(createdBy);

            _fileCache.Received().ReadFromCacheOrLoad(learningContentPath);
        }

        #endregion

    }
}
