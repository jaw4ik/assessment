using Newtonsoft.Json;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class LearningContentPackageModel
    {
        public string Id { get; set; }

        [JsonIgnore]
        public string Text { get; set; }
    }
}
