using System.Collections.Generic;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class CoursePackageModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public List<ObjectivePackageModel> Objectives { get; set; }
    }
}