using System;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class BlankAnswerPackageModel
    {
        public string Id { get; set; }
        public string Text { get; set; }
        public bool IsCorrect { get; set; }
        public bool MatchCase { get; set; }
    }
}