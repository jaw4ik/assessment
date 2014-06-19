using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.Web.BuildCourse.PackageModel
{
    public class FillInTheBlanksPackageModel : MultipleselectPackageModel
    {
        public override int Type
        {
            get { return 1; }
        }
    }
}