using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.BuildCourse.Modules;
using easygenerator.Web.Extensions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace easygenerator.Web.BuildLearningPath
{
    public class LearningPathCourseBuilder : ILearningPathCourseBuilder
    {
        private readonly PhysicalFileManager _fileManager;
        private readonly LearningPathContentPathProvider _contentPathProvider;
        private readonly ICourseContentProvider _buildContentProvider;
        private readonly IPackageModulesProvider _packageModulesProvider;

        public LearningPathCourseBuilder(PhysicalFileManager fileManager, LearningPathContentPathProvider contentPathProvider,
            ICourseContentProvider buildContentProvider, PackageModulesProvider packageModulesProvider)
        {
            _fileManager = fileManager;
            _contentPathProvider = contentPathProvider;
            _buildContentProvider = buildContentProvider;
            _packageModulesProvider = packageModulesProvider;
        }

        public virtual void Build(string buildDirectory, Course course, LearningPath learningPath)
        {
            var courseId = course.Id.ToNString();
            var courseDirectoryPath = _contentPathProvider.GetEntityDirectoryName(buildDirectory, courseId);
            CreateCourseDirectory(courseDirectoryPath);

            var modulesList = _packageModulesProvider.GetModulesList(course);
            _buildContentProvider.AddBuildContentToPackageDirectory(courseDirectoryPath, course, modulesList);

            var settings = getLearningPathCourseSettings(course, learningPath);
            _buildContentProvider.AddSettingsFileToPackageDirectory(courseDirectoryPath, settings);
        }

        private string getLearningPathCourseSettings(Course course, LearningPath learningPath)
        {
            var courseTemplateSettings = course.GetTemplateSettings(course.Template);
            if (courseTemplateSettings == null)
            {
                return learningPath.GetLearningPathSettings();
            }

            var courseSettings = JObject.Parse(courseTemplateSettings);
            var learningPathSettings = JObject.Parse(learningPath.GetLearningPathSettings());

            courseSettings.Merge(learningPathSettings, new JsonMergeSettings
            {
                MergeArrayHandling = MergeArrayHandling.Replace
            });

            return courseSettings.ToString(Formatting.None);
        }

        private void CreateCourseDirectory(string directoryPath)
        {
            _fileManager.CreateDirectory(directoryPath);
        }
    }
}