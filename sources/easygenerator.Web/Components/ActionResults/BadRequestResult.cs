using System.Net;

namespace easygenerator.Web.Components.ActionResults
{
    public class BadRequestResult : HttpStatusCodeWithMessageResult
    {
        public BadRequestResult()
            : base(HttpStatusCode.BadRequest)
        {

        }

        public BadRequestResult(string message)
            : base(HttpStatusCode.BadRequest, message)
        {

        }
    }
}