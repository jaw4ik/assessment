using System.Collections.Generic;

namespace easygenerator.Web.BuildExperience.BuildModel
{
    public class ExperienceBuildModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public List<ObjectiveBuildModel> Objectives { get; set; }
    }
}