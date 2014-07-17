using System.Collections.Generic;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class SingleSelectImagePackageModel : QuestionPackageModel
    {
        public List<SingleSelectImageAnswerPackageModel> Answers { get; set; }
        public string CorrectAnswerId { get; set; }

        public override int Type
        {
            get { return 5; }
        }
    }
}