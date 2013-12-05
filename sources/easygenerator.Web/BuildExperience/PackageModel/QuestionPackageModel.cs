using System.Collections.Generic;

namespace easygenerator.Web.BuildExperience.PackageModel
{
    public class QuestionPackageModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public bool HasContent { get; set; }
        public List<AnswerOptionPackageModel> Answers { get; set; }
        public List<LearningContentPackageModel> LearningContents { get; set; }
    }
}
