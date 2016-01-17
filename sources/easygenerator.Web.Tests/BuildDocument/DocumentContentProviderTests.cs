using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using easygenerator.Web.BuildDocument;
using easygenerator.Web.BuildDocument.PackageModel;

namespace easygenerator.Web.Tests.BuildDocument
{
    [TestClass]
    public class DocumentContentProviderTests
    {
        private DocumentContentProvider _buildContentProvider;

        private Document _document;
        private DocumentPackageModel _documentPackageModel;

        private DocumentContentPathProvider _buildPathProvider;
        private HttpRuntimeWrapper _httpRuntimeWrapper;
        private PhysicalFileManager _fileManager;
        private PackageModelSerializer _packageModelSerializer;
        private PackageModelMapper _packageModelMapper;
        
        [TestInitialize]
        public void InitializeContext()
        {
            _document = GetDocumentToBuild();
            _documentPackageModel = new PackageModelMapper(Substitute.For<IUserRepository>()).MapDocument(_document);

            _fileManager = Substitute.For<PhysicalFileManager>();
            _packageModelSerializer = Substitute.For<PackageModelSerializer>();

            _httpRuntimeWrapper = Substitute.For<HttpRuntimeWrapper>();
            _httpRuntimeWrapper.GetDomainAppPath().Returns(string.Empty);

            _buildPathProvider = Substitute.For<DocumentContentPathProvider>();
            _packageModelMapper = Substitute.For<PackageModelMapper>(Substitute.For<IUserRepository>());
            _packageModelMapper.MapDocument(_document).Returns(_documentPackageModel);

            _buildContentProvider = new DocumentContentProvider(_fileManager, _buildPathProvider, _packageModelSerializer, _packageModelMapper);
        }

        #region AddBuildContentToPackageDirectory

        #region Add document content

        [TestMethod]
        public void AddBuildContentToPackageDirectory_ShouldDeleteContentFile()
        {
            //Arrange
            var contentFile = "content.html";
            _buildPathProvider.GetContentFileName(Arg.Any<string>()).Returns(contentFile);

            //Act
            _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _document);

            //Assert
            _fileManager.Received().DeleteFile(contentFile);
        }

        [TestMethod]
        public void AddBuildContentToPackageDirectory_ShouldCreateContentFileWithEmbedCode()
        {
            //Arrange
            var contentFile = "content.html";
            _buildPathProvider.GetContentFileName(Arg.Any<string>()).Returns(contentFile);

            //Act
            _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _document);

            //Assert
            _fileManager.Received().WriteToFile(contentFile, _document.EmbedCode);
        }

        #endregion

        #region Add document data file

        [TestMethod]
        public void AddBuildContentToPackageDirectory_ShouldWriteSerializedPackageModelToFile()
        {
            //Arrange
            var packageModelFilePath = "SomePackageModelPath";
            var serializedPackageModel = "SomePackageModelData";

            _buildPathProvider.GetDataFileName(Arg.Any<string>()).Returns(packageModelFilePath);
            _packageModelSerializer.Serialize(_documentPackageModel).Returns(serializedPackageModel);

            //Act
            _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _document);

            //Assert
            _packageModelSerializer.Received().Serialize(_documentPackageModel);
            _fileManager.Received().WriteToFile(packageModelFilePath, serializedPackageModel);
        }

        #endregion

        #endregion

        #region Private methods

        private Document GetDocumentToBuild()
        {
            return DocumentObjectMother.Create("DocumentTitle");
        }

        #endregion
    }
}
