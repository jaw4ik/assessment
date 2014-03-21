using Newtonsoft.Json;
using System;
using System.Web.Mvc;

namespace easygenerator.Web.Components.ActionResults
{
    public class JsonDataResult : ActionResult
    {
        public object Data { get; set; }
        public string ContentType { get; set; }

        public JsonDataResult(object data = null, string contentType = null)
        {
            Data = data;
            ContentType = contentType;
        }

        public override void ExecuteResult(ControllerContext context)
        {
            if (context == null)
                throw new ArgumentNullException("context");

            var response = context.HttpContext.Response;
            response.ContentType = !string.IsNullOrEmpty(ContentType) ? ContentType : "application/json";

            if (Data == null)
                return;

            response.Clear();
            response.Write(JsonConvert.SerializeObject(Data));
        }
    }
}