using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace easygenerator.Web.ViewModels.Objective
{
    public class CreateObjectiveViewModel
    {
        [Required, StringLength(255)]
        public string Title { get; set; }
    }
}