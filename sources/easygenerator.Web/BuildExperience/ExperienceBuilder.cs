using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience.BuildModel;

namespace easygenerator.Web.BuildExperience
{
    public class ExperienceBuilder : IExperienceBuilder
    {
        private readonly PhysicalFileManager _fileManager;
        private readonly BuildPathProvider _buildPathProvider;
        private readonly BuildPackageCreator _buildPackageCreator;
        private readonly PackageModelMapper _packageModelMapper;
        private readonly PackageModelSerializer _packageModelSerializer;

        public ExperienceBuilder(PhysicalFileManager fileManager, BuildPathProvider buildPathProvider, BuildPackageCreator buildPackageCreator, PackageModelMapper packageModelMapper, PackageModelSerializer packageModelSerializer)
        {
            _fileManager = fileManager;
            _buildPathProvider = buildPathProvider;
            _buildPackageCreator = buildPackageCreator;
            _packageModelMapper = packageModelMapper;
            _packageModelSerializer = packageModelSerializer;
        }

        public bool Build(ExperienceBuildModel model)
        {
            try
            {
                _fileManager.CreateDirectory(_buildPathProvider.GetBuildDirectoryName(model.Id));
                _fileManager.CopyDirectory(_buildPathProvider.GetTemplateDirectoryName("Default"), _buildPathProvider.GetBuildDirectoryName(model.Id));
                _fileManager.DeleteDirectory(_buildPathProvider.GetContentDirectoryName(model.Id));

                foreach (ObjectiveBuildModel objective in model.Objectives)
                {
                    _fileManager.CreateDirectory(_buildPathProvider.GetObjectiveDirectoryName(model.Id, objective.Id));

                    foreach (QuestionBuildModel question in objective.Questions)
                    {
                        _fileManager.CreateDirectory(_buildPathProvider.GetQuestionDirectoryName(model.Id, objective.Id, question.Id));

                        foreach (ExplanationBuildModel explanation in question.Explanations)
                        {
                            _fileManager.WriteToFile(_buildPathProvider.GetExplanationFileName(model.Id, objective.Id, question.Id, explanation.Id),
                                explanation.Text);
                            explanation.Text = string.Empty;
                        }
                    }
                }

                _fileManager.WriteToFile(_buildPathProvider.GetDataFileName(model.Id),
                    _packageModelSerializer.Serialize(_packageModelMapper.MapExperienceBuildModel(model)));

                _buildPackageCreator.CreatePackageFromFolder(_buildPathProvider.GetBuildDirectoryName(model.Id),
                    _buildPathProvider.GetBuildPackageFileName(model.Id));

            }
            finally
            {
                _fileManager.DeleteDirectory(_buildPathProvider.GetBuildDirectoryName(model.Id));
            }

            return true;
        }
    }
}