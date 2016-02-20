using System.Collections.Generic;

namespace easygenerator.Web.Import.WinToWeb.Model
{
    public class WinQuestion
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string IncorrectFeedback { get; set; }
        public string CorrectFeedback { get; set; }
        public string Type { get; set; }
        public int? Order { get; set; }
        public bool? IsMultiple { get; set; }
        public string Background { get; set; }
        public List<WinAnswer> Answers { get; set; }
        public List<WinHotspotPolygon> HotspotPolygons { get; set; }
        public List<WinLearningContent> LearningContents { get; set; }
    }
}