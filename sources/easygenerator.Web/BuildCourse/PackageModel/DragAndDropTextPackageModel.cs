using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class DragAndDropTextPackageModel : QuestionPackageModel
    {
        public override int Type
        {
            get { return 2; }
        }

        public string Background { get; set; }
        public List<DropspotPackageModel> Dropspots { get; set; }
    }
}