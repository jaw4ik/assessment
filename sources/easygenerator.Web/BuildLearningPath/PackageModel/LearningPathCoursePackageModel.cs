﻿namespace easygenerator.Web.BuildLearningPath.PackageModel
{
    public class LearningPathCoursePackageModel: ILearningPathEntityPackageModel
    {
        public LearningPathEntityType Type { get; set; }
        public string Title { get; set; }
        public string Link { get; set; }
    }
}