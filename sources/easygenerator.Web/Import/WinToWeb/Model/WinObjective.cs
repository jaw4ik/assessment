using System.Collections.Generic;

namespace easygenerator.Web.Import.WinToWeb.Model
{
    public class WinObjective
    {
        public string Title { get; set; }
        public List<WinQuestion> Questions { get; set; }
        public int? Order { get; set; }
    }
}