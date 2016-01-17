using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.BuildLearningPath.PackageModel;

namespace easygenerator.Web.BuildLearningPath
{
    public class LearningPathContentProvider : ILearningPathContentProvider
    {
        private readonly PhysicalFileManager _fileManager;
        private readonly LearningPathContentPathProvider _contentPathProvider;
        private readonly PackageModelSerializer _packageModelSerializer;
        private readonly LearningPathPackageModelMapper _packageModelMapper;
        private readonly ILearningPathCourseBuilder _courseBuilder;
        private readonly ILearningPathDocumentBuilder _documentBuilder;

        public LearningPathContentProvider(PhysicalFileManager fileManager, LearningPathContentPathProvider contentPathProvider,
            LearningPathPackageModelMapper packageModelMapper, PackageModelSerializer packageModelSerializer, ILearningPathCourseBuilder courseBuilder, ILearningPathDocumentBuilder documentBuilder)
        {
            _fileManager = fileManager;
            _contentPathProvider = contentPathProvider;
            _packageModelMapper = packageModelMapper;
            _packageModelSerializer = packageModelSerializer;
            _courseBuilder = courseBuilder;
            _documentBuilder = documentBuilder;
        }

        public void AddContentToPackageDirectory(string buildDirectory, LearningPath learningPath)
        {
            AddLearningPathTemplate(buildDirectory);

            var contentDirectoryName = _contentPathProvider.GetContentDirectoryName(buildDirectory);
            _fileManager.DeleteDirectory(contentDirectoryName);
            _fileManager.CreateDirectory(contentDirectoryName);

            AddEntitiesToPackageDirectory(buildDirectory, learningPath.Entities);

            var packageModel = _packageModelMapper.MapLearningPath(learningPath);
            AddModelToPackageDirectory(buildDirectory, packageModel);
        }

        private void AddEntitiesToPackageDirectory(string buildDirectory, IEnumerable<ILearningPathEntity> entities)
        {
            foreach (var entity in entities)
            {
                if (entity is Course)
                {
                    _courseBuilder.Build(buildDirectory, (Course) entity);
                }
                else if (entity is Document)
                {
                    _documentBuilder.Build(buildDirectory, (Document) entity);
                }
            }
        }

        private void AddLearningPathTemplate(string buildDirectory)
        {
            _fileManager.CopyDirectory(_contentPathProvider.GetLearningPathTemplatePath(), buildDirectory);
        }

        private void AddModelToPackageDirectory(string buildDirectory, LearningPathPackageModel packageModel)
        {
            _fileManager.WriteToFile(_contentPathProvider.GetLearningPathModelFileName(buildDirectory),
                _packageModelSerializer.Serialize(packageModel));
        }
    }
}