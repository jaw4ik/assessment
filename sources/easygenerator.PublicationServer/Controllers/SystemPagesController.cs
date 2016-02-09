using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using easygenerator.PublicationServer.Configuration;

namespace easygenerator.PublicationServer.Controllers
{
    public class SystemPagesController : BaseApiController
    {
        private readonly StaticViewContentProvider _contentProvider;
        public SystemPagesController(StaticViewContentProvider contentProvider)
        {
            _contentProvider = contentProvider;
        }

        [Route("~/")]
        [HttpGet]
        public HttpResponseMessage HomePage()
        {
            return new HtmlPageResponseMessage("homepage.html", _contentProvider, HttpStatusCode.OK);
        }

        [HttpGet]
        public HttpResponseMessage PublishIsInProgress()
        {
            return new HtmlPageResponseMessage("maintenance.html", _contentProvider, HttpStatusCode.ServiceUnavailable);
        }

        [HttpGet]
        public HttpResponseMessage PageNotFound()
        {
            return new HtmlPageResponseMessage("404.html", _contentProvider, HttpStatusCode.NotFound);
        }
    }
}
