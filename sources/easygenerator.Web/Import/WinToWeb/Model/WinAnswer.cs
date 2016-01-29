using System;

namespace easygenerator.Web.Import.WinToWeb.Model
{
    public class WinAnswer
    {
        public string Text { get; set; }
        public bool? IsCorrect { get; set; }
        public string Image { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
        public Guid GroupId { get; set; }
        public bool MatchCase { get; set; }
    }
}