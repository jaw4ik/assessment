using System.Net;
using System.Web.Mvc;

namespace easygenerator.Web.Components.ActionResults
{
    public class SslRequiredResult : HttpStatusCodeResult
    {
        public SslRequiredResult() : base(HttpStatusCode.Forbidden, "SSL required") { }
    }
}