using System;
using System.ComponentModel.DataAnnotations;

namespace easygenerator.Web.ViewModels.Api
{
    public class BlankAnswerViewModel
    {
        public Guid GroupId { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string Text { get; set; }

        public bool IsCorrect { get; set; }
        public bool MatchCase { get; set; }
    }
}