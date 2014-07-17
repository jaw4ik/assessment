using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class FillInTheBlanksPackageModel : MultipleselectPackageModel
    {
        public override string Type
        {
            get { return Question.QuestionTypes.FillInTheBlanks; }
        }
    }
}