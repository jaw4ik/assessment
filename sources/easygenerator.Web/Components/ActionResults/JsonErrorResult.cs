using System.Web.Mvc;

namespace easygenerator.Web.Components.ActionResults
{
    public class JsonErrorResult : ActionResult
    {
        public string Message { get; set; }
        public string ResourceKey { get; set; }

        public JsonErrorResult(string message, string resourceKey = "")
        {
            Message = message;
            ResourceKey = resourceKey;
        }

        public override void ExecuteResult(ControllerContext context)
        {
            var data = new { success = false, message = Message, resourceKey = ResourceKey };
            new JsonDataResult(data).ExecuteResult(context);
        }
    }
}