using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace easygenerator.Web.ViewModels.Api
{
    public class AnswerViewModel
    {
        public Guid GroupId { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string Text { get; set; }

        public bool IsCorrect { get; set; }
    }
}