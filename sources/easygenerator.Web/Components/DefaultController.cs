using System.Collections.Generic;
using System.Net;
using System.Web.Mvc;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.ActionResults;

namespace easygenerator.Web.Components
{
    public abstract class DefaultController : Controller
    {
        protected ActionResult JsonSuccess()
        {
            return new JsonSuccessResult();
        }

        protected ActionResult JsonSuccess(object data)
        {
            return new JsonSuccessResult(data);
        }

        protected ActionResult JsonError(string message)
        {
            return new JsonErrorResult(message);
        }

        protected ActionResult JsonError(string message, List<BrokenRule> brokenRules)
        {
            return new JsonErrorResult(message, brokenRules);
        }

        protected ActionResult BadRequest()
        {
            return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        }
    }
}