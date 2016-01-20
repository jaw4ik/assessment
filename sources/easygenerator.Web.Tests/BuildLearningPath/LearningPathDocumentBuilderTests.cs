using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildLearningPath;
using easygenerator.Web.Components;
using easygenerator.Web.Extensions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using easygenerator.Web.BuildDocument;

namespace easygenerator.Web.Tests.BuildLearningPath
{
    [TestClass]
    public class LearningPathDocumentBuilderTests
    {
        private LearningPathDocumentBuilder _builder;
        private PhysicalFileManager _fileManager;
        private LearningPathContentPathProvider _contentPathProvider;
        private IDocumentContentProvider _buildContentProvider;

        [TestInitialize]
        public void InitializeContext()
        {
            _fileManager = Substitute.For<PhysicalFileManager>();
            _contentPathProvider = Substitute.For<LearningPathContentPathProvider>(Substitute.For<HttpRuntimeWrapper>());
            _buildContentProvider = Substitute.For<IDocumentContentProvider>();

            _builder = new LearningPathDocumentBuilder(_fileManager, _contentPathProvider, _buildContentProvider);
        }

        [TestMethod]
        public void Build_ShouldCreateDocumentBuildDirectory()
        {
            //Arrange
            var buildDirectoryPath = "buildDirectoryPath";
            var document = DocumentObjectMother.Create();
            var documentDirectory = "documentDirectory";
            _contentPathProvider.GetEntityDirectoryName(buildDirectoryPath, document.Id.ToNString()).Returns(documentDirectory);

            //Act
            _builder.Build(buildDirectoryPath, document);

            //Assert
            _fileManager.Received().CreateDirectory(documentDirectory);
        }

        [TestMethod]
        public void Build_ShouldAddDocumentContentIntoDocumentDirectory()
        {
            //Arrange
            var buildDirectoryPath = "buildDirectoryPath";
            var document = DocumentObjectMother.Create();
            var documentDirectory = "documentDirectory";
            _contentPathProvider.GetEntityDirectoryName(buildDirectoryPath, document.Id.ToNString()).Returns(documentDirectory);

            //Act
            _builder.Build(buildDirectoryPath, document);

            //Assert
            _buildContentProvider.Received().AddBuildContentToPackageDirectory(documentDirectory, document);
        }
    }
}
