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

        public ExperienceBuilder(PhysicalFileManager fileManager, BuildPathProvider buildPathProvider, BuildPackageCreator buildPackageCreator, PackageModelSerializer packageModelSerializer)
        {
            _fileManager = fileManager;
            _buildPathProvider = buildPathProvider;
            _buildPackageCreator = buildPackageCreator;
            _packageModelSerializer = packageModelSerializer;
        }

        public bool Build(ExperiencePackageModel model)
        {
            var buildId = model.Id;
            try
            {
                _fileManager.CreateDirectory(_buildPathProvider.GetBuildDirectoryName(buildId));
                _fileManager.CopyDirectory(_buildPathProvider.GetTemplateDirectoryName("Default"), _buildPathProvider.GetBuildDirectoryName(buildId));

                _fileManager.DeleteDirectory(_buildPathProvider.GetContentDirectoryName(buildId));
                _fileManager.CreateDirectory(_buildPathProvider.GetContentDirectoryName(buildId));

                foreach (ObjectivePackageModel objective in model.Objectives)
                {
                    _fileManager.CreateDirectory(_buildPathProvider.GetObjectiveDirectoryName(buildId, objective.Id));

                    foreach (QuestionPackageModel question in objective.Questions)
                    {
                        _fileManager.CreateDirectory(_buildPathProvider.GetQuestionDirectoryName(buildId, objective.Id, question.Id));

                        foreach (ExplanationPackageModel explanation in question.Explanations)
                        {
                            _fileManager.WriteToFile(_buildPathProvider.GetExplanationFileName(buildId, objective.Id, question.Id, explanation.Id),
                                explanation.Text);
                        }
                    }
                }

                _fileManager.WriteToFile(_buildPathProvider.GetDataFileName(buildId),
                    _packageModelSerializer.Serialize(model));

                _buildPackageCreator.CreatePackageFromFolder(_buildPathProvider.GetBuildDirectoryName(buildId),
                    _buildPathProvider.GetBuildPackageFileName(buildId));

            }
            finally
            {
                _fileManager.DeleteDirectory(_buildPathProvider.GetBuildDirectoryName(buildId));
            }

            return true;
        }
    }
}