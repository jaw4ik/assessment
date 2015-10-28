using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.Web.ViewModels.Dashboard
{
    public class CourseViewModel
    {
        public string Title { get; set; }
        public string Template { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }
        public DateTime? PublishedOn { get; set; }
        public bool HasBeenPublishedToEgHosting { get; set; }
        public string CourseLink { get; set; }
        public bool HasBeenPublishedToScorm { get; set; }
        public bool HasBeenPublishedToExternalLms { get; set; }
        public string PreviewLink { get; set; }
    }
}