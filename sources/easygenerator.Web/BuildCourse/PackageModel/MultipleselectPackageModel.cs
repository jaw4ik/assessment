using easygenerator.DomainModel.Entities.Questions;
using System.Collections.Generic;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class MultipleselectPackageModel : QuestionPackageModel
    {
        public override string Type
        {
            get { return Question.QuestionTypes.MultipleSelect; }
        }

        public List<AnswerOptionPackageModel> Answers { get; set; }
    }
}