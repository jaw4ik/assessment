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

        public string Message { get; set; }

        public override void ExecuteResult(ControllerContext context)
        {
            var jsonResult = new JsonResult
            {
                Data = new { success = false, message = Message },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                ContentType = "text/html"
            };

            jsonResult.ExecuteResult(context);
        }
    }
}