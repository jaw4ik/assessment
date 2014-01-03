using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience.PackageModel;

namespace easygenerator.Web.BuildExperience
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

        public virtual void AddBuildContentToPackageDirectory(string buildId, Experience experience)
        {
            var experiencePackageModel = _packageModelMapper.MapExperience(experience);

            AddTemplateToPackageDirectory(buildId, experience);
            AddExperienceContentToPackageDirectory(buildId, experiencePackageModel);
            AddExperienceDataFileToPackageDirectory(buildId, experiencePackageModel);
            AddTemplateSettingsFileToPackageDirectory(buildId, experience);
        }

        private void AddTemplateToPackageDirectory(string buildId, Experience experience)
        {
            _fileManager.CopyDirectory(_buildPathProvider.GetTemplateDirectoryName(experience.Template.Name),
                                       _buildPathProvider.GetBuildDirectoryName(buildId));
        }

        private void AddExperienceContentToPackageDirectory(string buildId, ExperiencePackageModel experiencePackageModel)
        {
            _fileManager.DeleteDirectory(_buildPathProvider.GetContentDirectoryName(buildId));
            _fileManager.CreateDirectory(_buildPathProvider.GetContentDirectoryName(buildId));

            foreach (var objective in experiencePackageModel.Objectives)
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

        private void AddExperienceDataFileToPackageDirectory(string buildId, ExperiencePackageModel experiencePackageModel)
        {
            _fileManager.WriteToFile(_buildPathProvider.GetDataFileName(buildId), _packageModelSerializer.Serialize(experiencePackageModel));
        }

        private void AddTemplateSettingsFileToPackageDirectory(string buildId, Experience experience)
        {
            _fileManager.WriteToFile(_buildPathProvider.GetSettingsFileName(buildId),
                                     experience.GetTemplateSettings(experience.Template) ?? String.Empty);
        }
    }
}