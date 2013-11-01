using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers
{
    [AllowAnonymous]
    [NoCache]
    public class MaintenanceController : DefaultController
    {
        public ActionResult PublishIsInProgress()
        {
            return View();
        }
    }
}
