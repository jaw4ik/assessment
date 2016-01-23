using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildDocument;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.BuildLearningPath
{
    public class LearningPathDocumentBuilder : ILearningPathDocumentBuilder
    {
        private readonly PhysicalFileManager _fileManager;
        private readonly LearningPathContentPathProvider _contentPathProvider;
        private readonly IDocumentContentProvider _buildContentProvider;

        public LearningPathDocumentBuilder(PhysicalFileManager fileManager, LearningPathContentPathProvider contentPathProvider,
            IDocumentContentProvider buildContentProvider)
        {
            _fileManager = fileManager;
            _contentPathProvider = contentPathProvider;
            _buildContentProvider = buildContentProvider;
        }

        public virtual void Build(string buildDirectory, Document document)
        {
            var documentId = document.Id.ToNString();
            var documentDirectoryPath = _contentPathProvider.GetEntityDirectoryName(buildDirectory, documentId);
            CreateDocumentDirectory(documentDirectoryPath);
            
            _buildContentProvider.AddBuildContentToPackageDirectory(documentDirectoryPath, document);
        }

        private void CreateDocumentDirectory(string directoryPath)
        {
            _fileManager.CreateDirectory(directoryPath);
        }
    }
}