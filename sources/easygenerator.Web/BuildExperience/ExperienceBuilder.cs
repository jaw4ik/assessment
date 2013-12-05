using System;
using System.IO;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience.PackageModel;

namespace easygenerator.Web.BuildExperience
{
    public class ExperienceBuilder : IExperienceBuilder
    {
        private readonly PhysicalFileManager _fileManager;
        private readonly BuildPathProvider _buildPathProvider;
        private readonly BuildPackageCreator _buildPackageCreator;
        private readonly PackageModelSerializer _packageModelSerializer;
        private readonly PackageModelMapper _packageModelMapper;

        public ExperienceBuilder(PhysicalFileManager fileManager, BuildPathProvider buildPathProvider, BuildPackageCreator buildPackageCreator, PackageModelSerializer packageModelSerializer, PackageModelMapper packageModelMapper)
        {
            _fileManager = fileManager;
            _buildPathProvider = buildPathProvider;
            _buildPackageCreator = buildPackageCreator;
            _packageModelSerializer = packageModelSerializer;
            _packageModelMapper = packageModelMapper;
        }

        public bool Build(Experience experience)
        {
            var experiencePackageModel = _packageModelMapper.MapExperience(experience);
            var buildId = GenerateBuildId(experiencePackageModel.Id);

            try
            {
                CreatePackageDirectory(buildId);

                AddTemplateToPackageDirectory(buildId, experience);
                AddExperienceContentToPackageDirectory(buildId, experiencePackageModel);
                AddExperienceDataFileToPackageDirectory(buildId, experiencePackageModel);
                AddTemplateSettingsFileToPackageDirectory(buildId, experience);

                CreatePackageFromDirectory(buildId);

                experience.UpdatePackageUrl(buildId + ".zip");
            }
            finally
            {
                DeleteOutdatedPackages(buildId, experiencePackageModel.Id);
                DeleteTempPackageDirectory(buildId);
            }

            return true;
        }

        private void CreatePackageDirectory(string buildId)
        {
            _fileManager.CreateDirectory(_buildPathProvider.GetBuildDirectoryName(buildId));
        }

        private void CreatePackageFromDirectory(string buildId)
        {
            _buildPackageCreator.CreatePackageFromFolder(_buildPathProvider.GetBuildDirectoryName(buildId),
                                                         _buildPathProvider.GetBuildPackageFileName(buildId));
        }

        private void AddTemplateToPackageDirectory(string buildId, Experience experience)
        {
            _fileManager.CopyDirectory(_buildPathProvider.GetTemplateDirectoryName(experience.Template.Name),
                                       _buildPathProvider.GetBuildDirectoryName(buildId));
        }

        private void AddExperienceDataFileToPackageDirectory(string buildId, ExperiencePackageModel experiencePackageModel)
        {
            _fileManager.WriteToFile(_buildPathProvider.GetDataFileName(buildId), _packageModelSerializer.Serialize(experiencePackageModel));
        }

        private void DeleteOutdatedPackages(string buildId, string packageId)
        {
            var packagePath = _buildPathProvider.GetDownloadPath();
            _fileManager.DeleteFilesInDirectory(packagePath, packageId + "*.zip", buildId + ".zip");
        }

        private void DeleteTempPackageDirectory(string buildId)
        {
            _fileManager.DeleteDirectory(_buildPathProvider.GetBuildDirectoryName(buildId));
        }

        private void AddTemplateSettingsFileToPackageDirectory(string buildId, Experience experience)
        {
            _fileManager.WriteToFile(_buildPathProvider.GetSettingsFileName(buildId),
                                     experience.GetTemplateSettings(experience.Template) ?? String.Empty);
        }

        private string GenerateBuildId(string packageId)
        {
            var buildDate = String.Format(" {0:yyyyMMdd-HH-mm-ss}-UTC", DateTimeWrapper.Now());
            return packageId + buildDate;
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
    }
}