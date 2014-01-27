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

        public BuildContentProvider(PhysicalFileManager fileManager, BuildPathProvider buildPathProvider, PackageModelSerializer packageModelSerializer, PackageModelMapper packageModelMapper)
        {
            _fileManager = fileManager;
            _buildPathProvider = buildPathProvider;
            _packageModelSerializer = packageModelSerializer;
            _packageModelMapper = packageModelMapper;
        }

        public virtual void AddBuildContentToPackageDirectory(string buildId, Course course, string publishSettings)
        {
            var coursePackageModel = _packageModelMapper.MapCourse(course);

            AddTemplateToPackageDirectory(buildId, course);
            AddCourseContentToPackageDirectory(buildId, coursePackageModel);
            AddCourseDataFileToPackageDirectory(buildId, coursePackageModel);
            AddTemplateSettingsFileToPackageDirectory(buildId, course);
            AddPublishSettingsFileToPackageDirectory(buildId, publishSettings);
        }

        private void AddTemplateToPackageDirectory(string buildId, Course course)
        {
            _fileManager.CopyDirectory(_buildPathProvider.GetTemplateDirectoryName(course.Template.Name),
                                       _buildPathProvider.GetBuildDirectoryName(buildId));
        }

        private void AddCourseContentToPackageDirectory(string buildId, CoursePackageModel coursePackageModel)
        {
            _fileManager.DeleteDirectory(_buildPathProvider.GetContentDirectoryName(buildId));
            _fileManager.CreateDirectory(_buildPathProvider.GetContentDirectoryName(buildId));

            if (coursePackageModel.HasIntroductionContent)
            {
                _fileManager.WriteToFile(_buildPathProvider.GetCourseIntroductionContentFileName(buildId), coursePackageModel.IntroductionContent);
            }

            foreach (var objective in coursePackageModel.Objectives)
            {
                _fileManager.CreateDirectory(_buildPathProvider.GetObjectiveDirectoryName(buildId, objective.Id));

                foreach (var question in objective.Questions)
                {
                    _fileManager.CreateDirectory(_buildPathProvider.GetQuestionDirectoryName(buildId, objective.Id, question.Id));
                    if (question.HasContent)
                    {
                        _fileManager.WriteToFile(_buildPathProvider.GetQuestionContentFileName(buildId, objective.Id, question.Id), question.Content);
                    }

                    foreach (var learningContent in question.LearningContents)
                    {
                        _fileManager.WriteToFile(_buildPathProvider.GetLearningContentFileName(buildId, objective.Id, question.Id, learningContent.Id), learningContent.Text);
                    }
                }
            }
        }

        private void AddCourseDataFileToPackageDirectory(string buildId, CoursePackageModel coursePackageModel)
        {
            _fileManager.WriteToFile(_buildPathProvider.GetDataFileName(buildId), _packageModelSerializer.Serialize(coursePackageModel));
        }

        private void AddTemplateSettingsFileToPackageDirectory(string buildId, Course course)
        {
            _fileManager.WriteToFile(_buildPathProvider.GetSettingsFileName(buildId),
                                     course.GetTemplateSettings(course.Template) ?? String.Empty);
        }

        private void AddPublishSettingsFileToPackageDirectory(string buildId, string settings)
        {
            _fileManager.WriteToFile(_buildPathProvider.GetPublishSettingsFileName(buildId), settings);
        }
    }
}