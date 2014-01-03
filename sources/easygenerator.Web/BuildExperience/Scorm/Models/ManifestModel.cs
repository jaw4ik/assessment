using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.Web.BuildExperience.Scorm.Models
{
    public class ManifestModel
    {
        public string CourseTitle { get; set; }
        public int MasteryScore { get; set; }
        public string StartPage { get; set; }
        public string Id { get; set; }
        public List<string> Resources { get; set; }

        public ManifestModel()
        {
            Resources = new List<string>();
        }
    }
}