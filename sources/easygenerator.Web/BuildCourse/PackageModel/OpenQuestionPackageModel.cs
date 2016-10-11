using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class OpenQuestionPackageModel : QuestionPackageModel
    {
        public override string Type => Question.QuestionTypes.OpenQuestion;
    }
}