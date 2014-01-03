using System.Collections.Generic;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class ObjectivePackageModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Image { get; set; }
        public List<QuestionPackageModel> Questions { get; set; }
    }
}
