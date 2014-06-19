using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class MultipleselectPackageModel : QuestionPackageModel
    {
        public override int Type
        {
            get { return 0; }
        }

        public List<AnswerOptionPackageModel> Answers { get; set; }
    }
}