using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse.Modules.Models;
using easygenerator.Web.BuildCourse.PackageModel;
using easygenerator.Web.Storage;
using Newtonsoft.Json;

namespace easygenerator.Web.BuildCourse
{
    public class CourseContentProvider : ICourseContentProvider
    {
        private readonly PhysicalFileManager _fileManager;
        private readonly CourseContentPathProvider _buildPathProvider;
        private readonly PackageModelSerializer _packageModelSerializer;
        private readonly ITemplateStorage _templateStorage;
        private readonly PackageModelMapper _packageModelMapper;
        private readonly PackageMediaEquiper _packageMediaEquiper;

        public CourseContentProvider(PhysicalFileManager fileManager,
                                    CourseContentPathProvider buildPathProvider,
                                    PackageModelSerializer packageModelSerializer,
                                    ITemplateStorage templateStorage,
                                    PackageModelMapper packageModelMapper,
                                    PackageMediaEquiper packageMediaEquiper)
        {
            _fileManager = fileManager;
            _buildPathProvider = buildPathProvider;
            _packageModelSerializer = packageModelSerializer;
            _templateStorage = templateStorage;
            _packageModelMapper = packageModelMapper;
            _packageMediaEquiper = packageMediaEquiper;
        }

        public void AddBuildContentToPackageDirectory(string buildDirectory, Course course, bool equip)
        {
            AddTemplateToPackageDirectory(buildDirectory, course);

            var coursePackageModel = _packageModelMapper.MapCourse(course);

            if (equip)
            {
                _packageMediaEquiper.EquipContentsMedia(buildDirectory, coursePackageModel);
            }

            AddCourseContentToPackageDirectory(buildDirectory, coursePackageModel);
            AddCourseDataFileToPackageDirectory(buildDirectory, coursePackageModel);
        }
        public void AddSettingsFileToPackageDirectory(string buildDirectory, string settings)
        {
            _fileManager.WriteToFile(_buildPathProvider.GetSettingsFileName(buildDirectory),
                settings ?? GetEmptyJsonContent());
        }

        public void AddPublishSettingsFileToPackageDirectory(string buildDirectory, string publishSettings)
        {
            _fileManager.WriteToFile(_buildPathProvider.GetPublishSettingsFileName(buildDirectory), publishSettings);
        }

        public void AddModulesFilesToPackageDirectory(string buildDirectory, IEnumerable<PackageModule> modules)
        {
            if (modules.Any())
            {
                _fileManager.CreateDirectory(_buildPathProvider.GetIncludedModulesDirectoryPath(buildDirectory));
            }
            foreach (var module in modules)
            {
                _fileManager.CopyFileToDirectory(module.GetFilePath(), _buildPathProvider.GetIncludedModulesDirectoryPath(buildDirectory));
            }
        }

        private void AddTemplateToPackageDirectory(string buildDirectory, Course course)
        {
            _fileManager.CopyDirectory(_templateStorage.GetTemplateDirectoryPath(course.Template), buildDirectory);
        }

        private void AddCourseContentToPackageDirectory(string buildDirectory, CoursePackageModel coursePackageModel)
        {
            _fileManager.DeleteDirectory(_buildPathProvider.GetContentDirectoryName(buildDirectory));
            _fileManager.CreateDirectory(_buildPathProvider.GetContentDirectoryName(buildDirectory));

            if (coursePackageModel.HasIntroductionContent)
            {
                _fileManager.WriteToFile(_buildPathProvider.GetCourseIntroductionContentFileName(buildDirectory), coursePackageModel.IntroductionContent);
            }

            foreach (var section in coursePackageModel.Sections)
            {
                _fileManager.CreateDirectory(_buildPathProvider.GetSectionDirectoryName(buildDirectory, section.Id));

                foreach (var question in section.Questions)
                {
                    _fileManager.CreateDirectory(_buildPathProvider.GetQuestionDirectoryName(buildDirectory, section.Id, question.Id));
                    if (question.HasContent)
                    {
                        _fileManager.WriteToFile(_buildPathProvider.GetQuestionContentFileName(buildDirectory, section.Id, question.Id), question.Content);
                    }

                    foreach (var learningContent in question.LearningContents)
                    {
                        _fileManager.WriteToFile(_buildPathProvider.GetLearningContentFileName(buildDirectory, section.Id, question.Id, learningContent.Id), learningContent.Text);
                    }

                    if (question.HasCorrectFeedback)
                    {
                        _fileManager.WriteToFile(_buildPathProvider.GetCorrectFeedbackContentFileName(buildDirectory, section.Id, question.Id), question.Feedback.CorrectText);
                    }
                    if (question.HasIncorrectFeedback)
                    {
                        _fileManager.WriteToFile(_buildPathProvider.GetIncorrectFeedbackContentFileName(buildDirectory, section.Id, question.Id), question.Feedback.IncorrectText);
                    }
                }
            }
        }

        private void AddCourseDataFileToPackageDirectory(string buildDirectory, CoursePackageModel coursePackageModel)
        {
            _fileManager.WriteToFile(_buildPathProvider.GetDataFileName(buildDirectory), _packageModelSerializer.Serialize(coursePackageModel));
        }

        private static string GetEmptyJsonContent()
        {
            return JsonConvert.SerializeObject(new {});
        }
    }
}