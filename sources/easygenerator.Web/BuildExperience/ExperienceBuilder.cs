using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience.BuildModel;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace easygenerator.Web.BuildExperience
{
    public class ExperienceBuilder : IExperienceBuilder
    {
        private readonly PhysicalFileManager _fileManager;
        private readonly BuildPathProvider _buildPathProvider;
        private readonly BuildPackageCreator _buildPackageCreator;

        public ExperienceBuilder(PhysicalFileManager fileManager, BuildPathProvider buildPathProvider, BuildPackageCreator buildPackageCreator)
        {
            _fileManager = fileManager;
            _buildPathProvider = buildPathProvider;
            _buildPackageCreator = buildPackageCreator;
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

                _fileManager.WriteToFile(_buildPathProvider.GetDataFileName(model.Id), SerializeBuildModel(model));
                _buildPackageCreator.CreatePackageFromFolder(_buildPathProvider.GetBuildDirectoryName(model.Id),
                    _buildPathProvider.GetBuildPackageFileName(model.Id));

            }
            finally
            {
                _fileManager.DeleteDirectory(_buildPathProvider.GetBuildDirectoryName(model.Id));
            }

            return true;
        }

        private string SerializeBuildModel(ExperienceBuildModel buildModel)
        {
            return JsonConvert.SerializeObject(
                    buildModel,
                    Formatting.None,
                    new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() }
                );
        }
    }
}