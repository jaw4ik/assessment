using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class CoursePackageModel
    {
        public string Id { get; set; }
        public string TemplateId { get; set; }
        public string Title { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        [JsonIgnore]
        public string IntroductionContent { get; set; }
        public bool HasIntroductionContent { get; set; }
        public List<SectionPackageModel> Sections { get; set; }
    }
}