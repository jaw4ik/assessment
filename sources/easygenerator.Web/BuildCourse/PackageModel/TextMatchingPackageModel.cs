using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class TextMatchingPackageModel : QuestionPackageModel
    {
        public override int Type
        {
            get { return 6; }
        }

        public List<TextMatchingAnswerPackageModel> Answers { get; set; }
    }
}