using System.Collections.Generic;
using System.Web.Mvc;
using easygenerator.Infrastructure;

namespace easygenerator.Web.Components.ActionResults
{
    public class JsonErrorResult : ActionResult
    {
        public JsonErrorResult(string message)
        {
            Message = message;
        }

        public JsonErrorResult(string message, List<BrokenRule> brokenRules)
        {
            Message = message;
            BrokenRules = brokenRules;
        }

        public string Message { get; set; }
        public List<BrokenRule> BrokenRules { get; set; }

        public override void ExecuteResult(ControllerContext context)
        {
            var jsonResult = new JsonResult
            {
                Data = new { success = false, message = Message, brokenRules = BrokenRules },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };

            jsonResult.ExecuteResult(context);
        }
    }
}