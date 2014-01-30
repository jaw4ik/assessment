using System;
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

        public JsonSuccessResult(object data, string contentType = "application/json")
            : this(data)
        {
            ContentType = contentType;
        }

        public string Message { get; set; }
        public object Data { get; set; }
        public string ContentType { get; set; }

        public override void ExecuteResult(ControllerContext context)
        {
            var jsonResult = new JsonResult
            {
                Data = new { success = true, message = Message, data = Data },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                MaxJsonLength = Int32.MaxValue,
                ContentType = ContentType ?? "application/json"
            };

            jsonResult.ExecuteResult(context);
        }
    }
}