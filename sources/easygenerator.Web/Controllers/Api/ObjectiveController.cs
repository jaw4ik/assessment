using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionResults;

namespace easygenerator.Web.Controllers.Api
{
    public class ObjectiveController : DefaultController
    {
        [HttpPost]
        public ActionResult Create()
        {
            return JsonSuccess(Guid.NewGuid().ToString().Replace("-", ""));
        }
    }
}