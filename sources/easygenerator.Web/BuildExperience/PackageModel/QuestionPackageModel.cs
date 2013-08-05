using System.Collections.Generic;

namespace easygenerator.Web.BuildExperience.PackageModel
{
    public class QuestionPackageModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public List<AnswerOptionPackageModel> Answers { get; set; }
        public List<ExplanationPackageModel> Explanations { get; set; }
    }
}
