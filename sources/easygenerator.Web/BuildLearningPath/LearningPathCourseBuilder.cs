using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.BuildCourse.Modules;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.BuildLearningPath
{
    public class LearningPathCourseBuilder : ILearningPathCourseBuilder
    {
        private readonly PhysicalFileManager _fileManager;
        private readonly BuildPathProvider _buildPathProvider;
        private readonly IBuildContentProvider _buildContentProvider;
        private readonly IPackageModulesProvider _packageModulesProvider;

        public LearningPathCourseBuilder(PhysicalFileManager fileManager, BuildPathProvider buildPathProvider,
            IBuildContentProvider buildContentProvider, PackageModulesProvider packageModulesProvider)
        {
            _fileManager = fileManager;
            _buildPathProvider = buildPathProvider;
            _buildContentProvider = buildContentProvider;
            _packageModulesProvider = packageModulesProvider;
        }

        public virtual void Build(Course course, string buildId)
        {
            var courseId = course.Id.ToNString();
            var courseDirectoryPath = _buildPathProvider.GetBuildDirectoryName(buildId, courseId);
            CreateCourseDirectory(courseDirectoryPath);

            var modulesList = _packageModulesProvider.GetModulesList(course);
            _buildContentProvider.AddBuildContentToPackageDirectory(courseDirectoryPath, course, modulesList);
        }

        private void CreateCourseDirectory(string directoryPath)
        {
            _fileManager.CreateDirectory(directoryPath);
        }
    }
}