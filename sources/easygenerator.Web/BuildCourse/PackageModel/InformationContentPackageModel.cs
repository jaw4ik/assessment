using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class InformationContentPackageModel : QuestionPackageModel
    {
        public override string Type => Question.QuestionTypes.InformationContent;
    }
}