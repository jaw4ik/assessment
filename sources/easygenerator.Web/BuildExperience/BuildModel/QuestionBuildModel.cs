using System.Collections.Generic;

namespace easygenerator.Web.BuildExperience.BuildModel
{
    public class QuestionBuildModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public List<AnswerOptionBuildModel> AnswerOptions { get; set; }
        public List<ExplanationBuildModel> Explanations { get; set; }
    }
}
