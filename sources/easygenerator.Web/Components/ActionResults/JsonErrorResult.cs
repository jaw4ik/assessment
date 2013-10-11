using System.Collections.Generic;
using System.Web.Mvc;
using easygenerator.Infrastructure;

namespace easygenerator.Web.Components.ActionResults
{
    public class JsonErrorResult : ActionResult
    {
        public JsonErrorResult(string message, string resourceKey)
        {
            Message = message;
            ResourceKey = resourceKey;
        }

        public JsonErrorResult(string message)
            : this(message, string.Empty)
        {
        }

        public string Message { get; set; }
        public string ResourceKey { get; set; }

        public override void ExecuteResult(ControllerContext context)
        {
            var jsonResult = new JsonResult
            {
                Data = new { success = false, message = Message, resourceKey = ResourceKey },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };

            jsonResult.ExecuteResult(context);
        }
    }
}