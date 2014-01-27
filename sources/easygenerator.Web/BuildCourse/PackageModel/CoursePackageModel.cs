using System.Collections.Generic;
using Newtonsoft.Json;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class CoursePackageModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        [JsonIgnore]
        public string IntroductionContent { get; set; }
        public bool HasIntroductionContent { get; set; }
        public List<ObjectivePackageModel> Objectives { get; set; }
    }
}