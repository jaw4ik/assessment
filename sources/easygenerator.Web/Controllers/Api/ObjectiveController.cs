using System;
using System.Web.Mvc;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.ViewModels.Objective;

namespace easygenerator.Web.Controllers.Api
{
    public class ObjectiveController : DefaultController
    {
        [HttpPost]
        public ActionResult Create()
        {
            return JsonSuccess(new
            {
                Id = Guid.NewGuid().ToString().Replace("-", ""),
                CreatedOn = DateTimeWrapper.Now()
            });
        }
    }
}