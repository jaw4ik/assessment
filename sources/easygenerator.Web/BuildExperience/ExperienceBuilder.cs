using easygenerator.Web.BuildExperience.BuildModel;

namespace easygenerator.Web.BuildExperience
{
    public class ExperienceBuilder : IExperienceBuilder
    {
        private readonly IBuildHelper _buildHelper;

        public ExperienceBuilder(IBuildHelper buildHelper)
        {
            _buildHelper = buildHelper;
        }

        public bool Build(ExperienceBuildModel model)
        {
            try
            {
                _buildHelper.CreateBuildDirectory(model.Id);
                _buildHelper.CopyTemplateToBuildDirectory(model.Id, "Default");

                foreach (ObjectiveBuildModel objective in model.Objectives)
                {
                    _buildHelper.CreateObjectiveDirectory(model.Id, objective.Id);

                    foreach (QuestionBuildModel question in objective.Questions)
                    {
                        _buildHelper.CreateQuestionDirectory(model.Id, objective.Id, question.Id);

                        foreach (ExplanationBuildModel explanation in question.Explanations)
                        {
                            _buildHelper.WriteExplanation(model.Id, objective.Id, question.Id, explanation.Id, explanation.Text);
                            explanation.Text = string.Empty;
                        }
                    }
                }

                _buildHelper.WriteDataToFile(model.Id, _buildHelper.SerializeBuildModel(model));
                _buildHelper.CreateBuildPackage(model.Id);
            }
            finally
            {
                _buildHelper.DeleteBuildDirectory(model.Id);
            }

            return true;
        }
    }
}