using System.Net;
using System.Web.Mvc;

namespace easygenerator.Web.Components.ActionResults
{
    public class HttpStatusCodeWithMessageResult : HttpStatusCodeResult
    {
        public string Message { get; set; }

        public HttpStatusCodeWithMessageResult(HttpStatusCode statusCode, string message = "")
            : base(statusCode)
        {
            Message = message;
        }

        public HttpStatusCodeWithMessageResult(int statusCode, string message = "")
            : base(statusCode)
        {
            Message = message;
        }

        public override void ExecuteResult(ControllerContext context)
        {
            var httpResponse = context.RequestContext.HttpContext.Response;

            if (context.HttpContext.Request.IsAjaxRequest() || !string.IsNullOrEmpty(Message))
            {
                httpResponse.TrySkipIisCustomErrors = true;
            }

            if (!string.IsNullOrEmpty(Message))
            {
                httpResponse.Clear();
                httpResponse.Write(Message);
            }

            base.ExecuteResult(context);
        }
    }
}