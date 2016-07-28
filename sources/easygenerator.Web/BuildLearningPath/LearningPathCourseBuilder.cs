using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.BuildCourse.Modules;
using easygenerator.Web.BuildCourse.PublishSettings;
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
        private readonly PublishSettingsProvider _publishSettingsProvider;

        public LearningPathCourseBuilder(PhysicalFileManager fileManager, 
            LearningPathContentPathProvider contentPathProvider,
            ICourseContentProvider buildContentProvider, 
            PackageModulesProvider packageModulesProvider,
            PublishSettingsProvider publishSettingsProvider)
        {
            _fileManager = fileManager;
            _contentPathProvider = contentPathProvider;
            _buildContentProvider = buildContentProvider;
            _packageModulesProvider = packageModulesProvider;
            _publishSettingsProvider = publishSettingsProvider;
        }

        public virtual void Build(string buildDirectory, Course course, LearningPath learningPath)
        {
            var courseId = course.Id.ToNString();
            var courseDirectoryPath = _contentPathProvider.GetEntityDirectoryName(buildDirectory, courseId);

            CreatePackageDirectory(courseDirectoryPath);

            _buildContentProvider.AddBuildContentToPackageDirectory(courseDirectoryPath, course);
            _buildContentProvider.AddSettingsFileToPackageDirectory(courseDirectoryPath, getLearningPathCourseSettings(course, learningPath));
            _buildContentProvider.AddThemeSettingsFileToPackageDirectory(courseDirectoryPath, course.GetTemplateThemeSettings(course.Template));
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

        private void CreatePackageDirectory(string buildDirectory)
        {
            _fileManager.CreateDirectory(buildDirectory);
        }
    }
}