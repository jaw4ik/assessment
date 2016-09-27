using easygenerator.DomainModel.Entities.Questions;
using System.Collections.Generic;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class MultipleselectPackageModel : SurveyQuestionPackageModel
    {
        public override string Type => Question.QuestionTypes.MultipleSelect;

        public List<AnswerOptionPackageModel> Answers { get; set; }
    }
}