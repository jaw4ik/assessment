using easygenerator.Web.BuildExperience.BuildModel;

namespace easygenerator.Web.BuildExperience
{
    public interface IBuildHelper
    {
        void CreateBuildDirectory(string buildId);
        void DeleteBuildDirectory(string buildId);
        void CopyTemplateToBuildDirectory(string buildId, string templateName);
        void CreateObjectiveDirectory(string buildId, string objectiveId);
        void CreateQuestionDirectory(string buildId, string objectiveId, string questionId);
        void WriteExplanation(string buildId, string objectiveId, string questionId, string explanationId, string explanationText);
        void WriteDataToFile(string buildId, string data);
        string SerializeBuildModel(ExperienceBuildModel buildModel);
        void CreateBuildPackage(string buildId);
    }
}
