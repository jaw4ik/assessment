using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildDocument.PackageModel;

namespace easygenerator.Web.BuildDocument
{
    public class DocumentContentProvider : IDocumentContentProvider
    {
        private readonly PhysicalFileManager _fileManager;
        private readonly DocumentContentPathProvider _buildPathProvider;
        private readonly PackageModelSerializer _packageModelSerializer;
        private readonly PackageModelMapper _packageModelMapper;

        public DocumentContentProvider(PhysicalFileManager fileManager,
                                    DocumentContentPathProvider buildPathProvider,
                                    PackageModelSerializer packageModelSerializer,
                                    PackageModelMapper packageModelMapper)
        {
            _fileManager = fileManager;
            _buildPathProvider = buildPathProvider;
            _packageModelSerializer = packageModelSerializer;
            _packageModelMapper = packageModelMapper;
        }

        public void AddBuildContentToPackageDirectory(string buildDirectory, Document document)
        {
            var documentPackageModel = _packageModelMapper.MapDocument(document);

            AddDocumentContentToPackageDirectory(buildDirectory, documentPackageModel);
            AddDocumentDataFileToPackageDirectory(buildDirectory, documentPackageModel);
        }

        private void AddDocumentContentToPackageDirectory(string buildDirectory, DocumentPackageModel documentPackageModel)
        {
            var contentFilePath = _buildPathProvider.GetContentFileName(buildDirectory);
            _fileManager.DeleteFile(contentFilePath);
            _fileManager.WriteToFile(contentFilePath, documentPackageModel.EmbedCode);
        }

        private void AddDocumentDataFileToPackageDirectory(string buildDirectory, DocumentPackageModel documentPackageModel)
        {
            _fileManager.WriteToFile(_buildPathProvider.GetDataFileName(buildDirectory), _packageModelSerializer.Serialize(documentPackageModel));
        }
    }
}