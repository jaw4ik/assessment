using System.Collections.Generic;

namespace easygenerator.Web.Import.WinToWeb.Model
{
    public class WinCourse
    {
        public string Title { get; set; }
        public List<WinObjective> Objectives { get; set; }
        public string Introduction { get; set; }
    }
}