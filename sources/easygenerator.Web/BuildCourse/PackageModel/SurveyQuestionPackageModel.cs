
namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class SurveyQuestionPackageModel : QuestionPackageModel
    {
        public override string Type { get; }
        public bool? IsSurvey { get; set; }
    }
}