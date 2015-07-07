using System.Collections.Generic;

namespace easygenerator.Web.BuildLearningPath.PackageModel
{
    public class LearningPathPackageModel
    {
        public string Title { get; set; }
        public List<LearningPathCoursePackageModel> Courses { get; set; }
    }
}