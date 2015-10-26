using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class ScenarioQuestionPackageModel : QuestionPackageModel
    {
        public override string Type => Question.QuestionTypes.Scenario;

        public string ProjectId { get; set; }
        public string EmbedCode { get; set; }
        public string EmbedUrl { get; set; }
        public string ProjectArchiveUrl { get; set; }
        public int MasteryScore { get; set; }
    }
}