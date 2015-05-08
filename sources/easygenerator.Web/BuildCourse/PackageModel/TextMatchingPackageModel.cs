using easygenerator.DomainModel.Entities.Questions;
using System.Collections.Generic;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class TextMatchingPackageModel : QuestionPackageModel
    {
        public override string Type
        {
            get { return Question.QuestionTypes.TextMatching; }
        }

        public List<TextMatchingAnswerPackageModel> Answers { get; set; }
    }
}