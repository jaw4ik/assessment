using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

namespace easygenerator.Web.ViewModels.Dashboard
{
    public class UpgradeUserViewModel
    {
        public IEnumerable<SelectListItem> UserPlansList;

        public string UserEmail { get; set; }

        [DisplayFormat(DataFormatString = "{0:M'/'d'/'yyyy}", ApplyFormatInEditMode = true)]
        public DateTime? ExpirationDate { get; set; }
    }
}