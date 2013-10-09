using System.Web.Mvc;

namespace easygenerator.Web.Components.ActionResults
{
    public class JsonSuccessResult : ActionResult
    {
        public JsonSuccessResult()
        {
        }

        public JsonSuccessResult(object data)
        {
            Data = data;
        }

        public string Message { get; set; }
        public object Data { get; set; }

        public override void ExecuteResult(ControllerContext context)
        {
            var jsonResult = new JsonResult
            {
                Data = new { success = true, message = Message, data = Data },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                ContentType = "text/html"
            };

            jsonResult.ExecuteResult(context);
        }
    }
}