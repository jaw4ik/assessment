using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse.Modules.Models;
using easygenerator.Web.BuildCourse.PackageModel;
using easygenerator.Web.BuildCourse.PublishSettings;
using easygenerator.Web.Storage;
using Newtonsoft.Json;

namespace easygenerator.Web.BuildCourse
{
    public class BuildContentProvider : IBuildContentProvider
    {
        private readonly PhysicalFileManager _fileManager;
        private readonly BuildPathProvider _buildPathProvider;
        private readonly PackageModelSerializer _packageModelSerializer;
        private readonly PackageModelMapper _packageModelMapper;
        private readonly PublishSettingsProvider _publishSettingsProvider;
        private readonly ITemplateStorage _templateStorage;

        public BuildContentProvider(PhysicalFileManager fileManager,
                                    BuildPathProvider buildPathProvider,
                                    PackageModelSerializer packageModelSerializer,
                                    PackageModelMapper packageModelMapper,
                                    PublishSettingsProvider publishSettingsProvider,
                                    ITemplateStorage templateStorage)
        {
            _fileManager = fileManager;
            _buildPathProvider = buildPathProvider;
            _packageModelSerializer = packageModelSerializer;
            _packageModelMapper = packageModelMapper;
            _publishSettingsProvider = publishSettingsProvider;
            _templateStorage = templateStorage;
        }

        public void AddBuildContentToPackageDirectory(string buildDirectory, Course course, IEnumerable<PackageModule> modules)
        {
            var coursePackageModel = _packageModelMapper.MapCourse(course);

            AddTemplateToPackageDirectory(buildDirectory, course);
            AddCourseContentToPackageDirectory(buildDirectory, coursePackageModel);
            AddCourseDataFileToPackageDirectory(buildDirectory, coursePackageModel);
            AddTemplateSettingsFileToPackageDirectory(buildDirectory, course);
            AddPublishSettingsFileToPackageDirectory(buildDirectory, _publishSettingsProvider.GetPublishSettings(modules));
            AddModulesFilesToPackageDirectory(buildDirectory, modules);
        }

        private void AddPublishSettingsFileToPackageDirectory(string buildDirectory, string publishSettings)
        {
            _fileManager.WriteToFile(_buildPathProvider.GetPublishSettingsFileName(buildDirectory), publishSettings);
        }

        private void AddModulesFilesToPackageDirectory(string buildDirectory, IEnumerable<PackageModule> modules)
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

            foreach (var objective in coursePackageModel.Objectives)
            {
                _fileManager.CreateDirectory(_buildPathProvider.GetObjectiveDirectoryName(buildDirectory, objective.Id));

                foreach (var question in objective.Questions)
                {
                    _fileManager.CreateDirectory(_buildPathProvider.GetQuestionDirectoryName(buildDirectory, objective.Id, question.Id));
                    if (question.HasContent)
                    {
                        _fileManager.WriteToFile(_buildPathProvider.GetQuestionContentFileName(buildDirectory, objective.Id, question.Id), question.Content);
                    }

                    foreach (var learningContent in question.LearningContents)
                    {
                        _fileManager.WriteToFile(_buildPathProvider.GetLearningContentFileName(buildDirectory, objective.Id, question.Id, learningContent.Id), learningContent.Text);
                    }

                    if (question.HasCorrectFeedback)
                    {
                        _fileManager.WriteToFile(_buildPathProvider.GetCorrectFeedbackContentFileName(buildDirectory, objective.Id, question.Id), question.Feedback.CorrectText);
                    }
                    if (question.HasIncorrectFeedback)
                    {
                        _fileManager.WriteToFile(_buildPathProvider.GetIncorrectFeedbackContentFileName(buildDirectory, objective.Id, question.Id), question.Feedback.IncorrectText);
                    }
                }
            }
        }

        private void AddCourseDataFileToPackageDirectory(string buildDirectory, CoursePackageModel coursePackageModel)
        {
            _fileManager.WriteToFile(_buildPathProvider.GetDataFileName(buildDirectory), _packageModelSerializer.Serialize(coursePackageModel));
        }

        private void AddTemplateSettingsFileToPackageDirectory(string buildDirectory, Course course)
        {
            _fileManager.WriteToFile(_buildPathProvider.GetSettingsFileName(buildDirectory),
                course.GetTemplateSettings(course.Template) ?? GetEmptyJsonContent());
        }

        private static string GetEmptyJsonContent()
        {
            return JsonConvert.SerializeObject(new {});
        }
    }
}