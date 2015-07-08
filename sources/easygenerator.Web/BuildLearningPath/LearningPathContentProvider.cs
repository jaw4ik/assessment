using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.BuildLearningPath.PackageModel;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.BuildLearningPath
{
    public class LearningPathContentProvider : ILearningPathContentProvider
    {
        private readonly PhysicalFileManager _fileManager;
        private readonly LearningPathContentPathProvider _contentPathProvider;
        private readonly PackageModelSerializer _packageModelSerializer;
        private readonly LearningPathPackageModelMapper _packageModelMapper;
        private readonly ILearningPathCourseBuilder _courseBuilder;

        public LearningPathContentProvider(PhysicalFileManager fileManager, LearningPathContentPathProvider contentPathProvider,
            LearningPathPackageModelMapper packageModelMapper, PackageModelSerializer packageModelSerializer, ILearningPathCourseBuilder courseBuilder)
        {
            _fileManager = fileManager;
            _contentPathProvider = contentPathProvider;
            _packageModelMapper = packageModelMapper;
            _packageModelSerializer = packageModelSerializer;
            _courseBuilder = courseBuilder;
        }

        public void AddContentToPackageDirectory(string buildDirectory, LearningPath learningPath)
        {
            AddLearningPathTemplate(buildDirectory);

            var contentDirectoryName = _contentPathProvider.GetContentDirectoryName(buildDirectory);
            _fileManager.DeleteDirectory(contentDirectoryName);
            _fileManager.CreateDirectory(contentDirectoryName);

            AddCoursesToPackageDirectory(buildDirectory, learningPath.Courses);

            var packageModel = _packageModelMapper.MapLearningPath(learningPath);
            AddModelToPackageDirectory(buildDirectory, packageModel);
        }

        private void AddCoursesToPackageDirectory(string buildDirectory, IEnumerable<Course> courses)
        {
            foreach (var course in courses)
            {
                _courseBuilder.Build(buildDirectory, course);
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