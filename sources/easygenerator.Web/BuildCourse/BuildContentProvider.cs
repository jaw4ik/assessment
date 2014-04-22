using System;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse.PackageModel;

namespace easygenerator.Web.BuildCourse
{
    public class BuildContentProvider
    {
        private readonly PhysicalFileManager _fileManager;
        private readonly BuildPathProvider _buildPathProvider;
        private readonly PackageModelSerializer _packageModelSerializer;
        private readonly PackageModelMapper _packageModelMapper;

        public BuildContentProvider(PhysicalFileManager fileManager,
                                    BuildPathProvider buildPathProvider,
                                    PackageModelSerializer packageModelSerializer,
                                    PackageModelMapper packageModelMapper)
        {
            _fileManager = fileManager;
            _buildPathProvider = buildPathProvider;
            _packageModelSerializer = packageModelSerializer;
            _packageModelMapper = packageModelMapper;
        }

        public virtual void AddBuildContentToPackageDirectory(string buildDirectory, Course course, string publishSettings)
        {
            var coursePackageModel = _packageModelMapper.MapCourse(course);

            AddTemplateToPackageDirectory(buildDirectory, course);
            AddCourseContentToPackageDirectory(buildDirectory, coursePackageModel);
            AddCourseDataFileToPackageDirectory(buildDirectory, coursePackageModel);
            AddTemplateSettingsFileToPackageDirectory(buildDirectory, course);
            AddPublishSettingsFileToPackageDirectory(buildDirectory, publishSettings);
        }

        private void AddTemplateToPackageDirectory(string buildDirectory, Course course)
        {
            _fileManager.CopyDirectory(_buildPathProvider.GetTemplateDirectoryName(course.Template.Name), buildDirectory);
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
                course.GetTemplateSettings(course.Template) ?? String.Empty);
        }

        private void AddPublishSettingsFileToPackageDirectory(string buildDirectory, string settings)
        {
            _fileManager.WriteToFile(_buildPathProvider.GetPublishSettingsFileName(buildDirectory), settings);
        }
    }
}