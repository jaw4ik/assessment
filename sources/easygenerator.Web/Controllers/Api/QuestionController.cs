using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using easygenerator.Web.Components;

namespace easygenerator.Web.Controllers.Api
{
    public class QuestionController : DefaultController
    {

        [HttpPost]
        public ActionResult Create()
        {
            return JsonSuccess(new
            {
                Id = Guid.NewGuid().ToString("N"),
                CreatedOn = DateTime.Now
            });
        }

    }
}
