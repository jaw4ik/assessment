using System.Net;
using System.Web.Mvc;

namespace easygenerator.Web.Components.ActionResults
{
    public class ForbiddenResult : HttpStatusCodeWithMessageResult
    {
        private readonly string _resourceKey;
        private const string ErrorMessageResourceKeyHeader = "ErrorMessageResourceKey";

        public ForbiddenResult(string resourceKey = "", string message = "") :
            base(HttpStatusCode.Forbidden, message)
        {
            _resourceKey = resourceKey;
        }

        public override void ExecuteResult(ControllerContext context)
        {
            var httpResponse = context.RequestContext.HttpContext.Response;

            if (!string.IsNullOrEmpty(_resourceKey))
            {
                httpResponse.AppendHeader(ErrorMessageResourceKeyHeader, _resourceKey);
            }

            base.ExecuteResult(context);
        }
    }
}