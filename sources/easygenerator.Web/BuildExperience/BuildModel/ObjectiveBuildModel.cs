using System.Collections.Generic;

namespace easygenerator.Web.BuildExperience.BuildModel
{
    public class ObjectiveBuildModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Image { get; set; }
        public List<QuestionBuildModel> Questions { get; set; }
    }
}
