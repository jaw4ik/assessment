using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace easygenerator.PublicationServer.Controllers
{
    public class SystemPagesController : BaseApiController
    {
        private readonly StaticViewContentProvider _contentProvider;
        public SystemPagesController(StaticViewContentProvider contentProvider)
        {
            _contentProvider = contentProvider;
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
