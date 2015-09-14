using System;
using System.Collections.Generic;

namespace easygenerator.Web.BuildLearningPath.PackageModel
{
    public class LearningPathPackageModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public DateTime CreatedOn { get; set; }
        public List<LearningPathCoursePackageModel> Courses { get; set; }
    }
}