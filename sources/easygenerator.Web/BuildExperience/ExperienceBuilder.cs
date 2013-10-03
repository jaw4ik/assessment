using System;
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
            var buildDate = String.Format(" {0:yyyyMMdd-HH-mm-ss}-UTC", DateTimeWrapper.Now());
            var experiencePackageModel = _packageModelMapper.MapExperience(experience);

            var buildId = experiencePackageModel.Id + buildDate;
            try
            {
                _fileManager.CreateDirectory(_buildPathProvider.GetBuildDirectoryName(buildId));
                _fileManager.CopyDirectory(_buildPathProvider.GetTemplateDirectoryName(experience.Template.Name), _buildPathProvider.GetBuildDirectoryName(buildId));

                _fileManager.DeleteDirectory(_buildPathProvider.GetContentDirectoryName(buildId));
                _fileManager.CreateDirectory(_buildPathProvider.GetContentDirectoryName(buildId));

                foreach (ObjectivePackageModel objective in experiencePackageModel.Objectives)
                {
                    _fileManager.CreateDirectory(_buildPathProvider.GetObjectiveDirectoryName(buildId, objective.Id));

                    foreach (QuestionPackageModel question in objective.Questions)
                    {
                        _fileManager.CreateDirectory(_buildPathProvider.GetQuestionDirectoryName(buildId, objective.Id, question.Id));

                        foreach (LearningObjectPackageModel learningObject in question.LearningObjects)
                        {
                            _fileManager.WriteToFile(_buildPathProvider.GetLearningObjectFileName(buildId, objective.Id, question.Id, learningObject.Id),
                                learningObject.Text);
                        }
                    }
                }

                _fileManager.WriteToFile(_buildPathProvider.GetDataFileName(buildId),
                    _packageModelSerializer.Serialize(experiencePackageModel));

                _buildPackageCreator.CreatePackageFromFolder(_buildPathProvider.GetBuildDirectoryName(buildId),
                    _buildPathProvider.GetBuildPackageFileName(buildId));

                experience.UpdatePackageUrl(buildId + ".zip");
            }
            finally
            {
                _fileManager.DeletePreviousFiles(_buildPathProvider.GetDownloadPath(), buildId, experiencePackageModel.Id);
                _fileManager.DeleteDirectory(_buildPathProvider.GetBuildDirectoryName(buildId));
            }

            return true;
        }
    }
}