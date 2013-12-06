using Newtonsoft.Json;
using System.Web.Script.Serialization;

namespace easygenerator.Web.BuildExperience.PackageModel
{
    public class LearningContentPackageModel
    {
        public string Id { get; set; }

        [JsonIgnore]
        public string Text { get; set; }
    }
}
