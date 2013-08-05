using System.Collections.Generic;

namespace easygenerator.Web.BuildExperience.PackageModel
{
    public class ExperiencePackageModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public List<ObjectivePackageModel> Objectives { get; set; }
    }
}