using System.Web.Mvc;

namespace easygenerator.Web.Components.ActionResults
{
    public class JsonSuccessResult : ActionResult
    {
        public object Data { get; set; }
        public string ContentType { get; set; }

        public JsonSuccessResult(object data = null, string contentType = null)
        {
            Data = data;
            ContentType = contentType;
        }

        public override void ExecuteResult(ControllerContext context)
        {
            var data = new { success = true, data = Data };
            new JsonDataResult(data, ContentType).ExecuteResult(context);
        }
    }
}