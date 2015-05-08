using System;
using System.Collections.Generic;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class BlankAnswerGroupPackageModel
    {
        public string Id { get; set; }
        public List<BlankAnswerPackageModel> Answers { get; set; }
    }
}