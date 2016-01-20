using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.BuildLearningPath;
using easygenerator.Web.BuildLearningPath.PackageModel;
using easygenerator.Web.Components;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.BuildLearningPath
{
    [TestClass]
    public class LearningPathContentProviderTests
    {
        private LearningPathContentProvider _contentProvider;

        private PhysicalFileManager _fileManager;
        private LearningPathContentPathProvider _contentPathProvider;
        private LearningPathPackageModelMapper _packageModelMapper;
        private PackageModelSerializer _packageModelSerializer;
        private ILearningPathCourseBuilder _courseBuilder;
        private ILearningPathDocumentBuilder _documentBuilder;

        [TestInitialize]
        public void InitializeContext()
        {
            _fileManager = Substitute.For<PhysicalFileManager>();
            _contentPathProvider = Substitute.For<LearningPathContentPathProvider>(Substitute.For<HttpRuntimeWrapper>());
            _packageModelMapper = Substitute.For<LearningPathPackageModelMapper>(_contentPathProvider);
            _packageModelSerializer = Substitute.For<PackageModelSerializer>();
            _courseBuilder = Substitute.For<ILearningPathCourseBuilder>();
            _documentBuilder = Substitute.For<ILearningPathDocumentBuilder>();

            _contentProvider = new LearningPathContentProvider(_fileManager, _contentPathProvider, _packageModelMapper, _packageModelSerializer, _courseBuilder, _documentBuilder);
        }

        #region MyRegion

        [TestMethod]
        public void AddContentToPackageDirectory_ShouldAddLearningPathTemplate()
        {
            //Arrange
            var buildDirectoryPath = "buildDirectoryPath";
            var learningPath = LearningPathObjectMother.Create();
            var templatePath = "templatePath";
            _contentPathProvider.GetLearningPathTemplatePath().Returns(templatePath);

            //Act
            _contentProvider.AddContentToPackageDirectory(buildDirectoryPath, learningPath);

            //Assert
            _fileManager.Received().CopyDirectory(templatePath, buildDirectoryPath);
        }

        [TestMethod]
        public void AddContentToPackageDirectory_ShouldDeleteContentDirectory()
        {
            //Arrange
            var buildDirectoryPath = "buildDirectoryPath";
            var learningPath = LearningPathObjectMother.Create();
            var contentDirectoryPath = "contentDirectoryPath";
            _contentPathProvider.GetContentDirectoryName(buildDirectoryPath).Returns(contentDirectoryPath);

            //Act
            _contentProvider.AddContentToPackageDirectory(buildDirectoryPath, learningPath);

            //Assert
            _fileManager.Received().DeleteDirectory(contentDirectoryPath);
        }

        [TestMethod]
        public void AddContentToPackageDirectory_ShouldCreateContentDirectory()
        {
            //Arrange
            var buildDirectoryPath = "buildDirectoryPath";
            var learningPath = LearningPathObjectMother.Create();
            var contentDirectoryPath = "contentDirectoryPath";
            _contentPathProvider.GetContentDirectoryName(buildDirectoryPath).Returns(contentDirectoryPath);

            //Act
            _contentProvider.AddContentToPackageDirectory(buildDirectoryPath, learningPath);

            //Assert
            _fileManager.Received().CreateDirectory(contentDirectoryPath);
        }

        [TestMethod]
        public void AddContentToPackageDirectory_ShouldAddEntities()
        {
            //Arrange
            var buildDirectoryPath = "buildDirectoryPath";
            var learningPath = LearningPathObjectMother.Create();
            var course1 = CourseObjectMother.Create();
            var course2 = CourseObjectMother.Create();
            var document1 = DocumentObjectMother.Create();
            var document2 = DocumentObjectMother.Create();
            learningPath.AddEntity(course1, null, "author");
            learningPath.AddEntity(course2, null, "author");
            learningPath.AddEntity(document1, null, "author");
            learningPath.AddEntity(document2, null, "author");

            //Act
            _contentProvider.AddContentToPackageDirectory(buildDirectoryPath, learningPath);

            //Assert
            _courseBuilder.Received().Build(buildDirectoryPath, course1);
            _courseBuilder.Received().Build(buildDirectoryPath, course2);
            _documentBuilder.Received().Build(buildDirectoryPath, document1);
            _documentBuilder.Received().Build(buildDirectoryPath, document2);
        }

        [TestMethod]
        public void AddContentToPackageDirectory_ShouldAddPackageModel()
        {
            //Arrange
            var buildDirectoryPath = "buildDirectoryPath";
            var learningPath = LearningPathObjectMother.Create();
            var learningPathModel = new LearningPathPackageModel();
            _packageModelMapper.MapLearningPath(learningPath).Returns(learningPathModel);
            var serializedModel = "serializedModel";
            _packageModelSerializer.Serialize(learningPathModel).Returns(serializedModel);
            var modelFilePath = "modelFilePath";
            _contentPathProvider.GetLearningPathModelFileName(buildDirectoryPath).Returns(modelFilePath);

            //Act
            _contentProvider.AddContentToPackageDirectory(buildDirectoryPath, learningPath);

            //Assert
            _fileManager.Received().WriteToFile(modelFilePath, serializedModel);
        }

        #endregion
    }
}
