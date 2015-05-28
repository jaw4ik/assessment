using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using easygenerator.Web.Components.ActionFilters;

namespace easygenerator.Web.Controllers
{
    public class ApplicationController : Controller
    {
        [AllowAnonymous]
        [NoCache]
        public ActionResult Index()
        {
            return View();
        }
    }
}
