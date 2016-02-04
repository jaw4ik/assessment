using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class RankingTextPackageModel : QuestionPackageModel
    {
        public override string Type
        {
            get { return Question.QuestionTypes.RankingText; }
        }

        public List<RankingTextAnswerPackageModel> Answers { get; set; }
    }
}