using System.Net;
using System.Net.Http;
using System.Web.Http;
using easygenerator.PublicationServer.HttpResponseMessages;

namespace easygenerator.PublicationServer.Controllers
{
    public class SystemPagesController : BaseApiController
    {
        private readonly HttpResponseMessageFactory _httpResponseMessageFactory;
        public SystemPagesController(HttpResponseMessageFactory httpResponseMessageFactory)
        {
            _httpResponseMessageFactory = httpResponseMessageFactory;
        }

        [Route("~/")]
        [HttpGet]
        public HttpResponseMessage HomePage()
        {
            return _httpResponseMessageFactory.HtmlPage("homepage.html", HttpStatusCode.OK);
        }

        [HttpGet]
        public HttpResponseMessage PublishIsInProgress()
        {
            return _httpResponseMessageFactory.Maintenance();
        }

        [HttpGet]
        public HttpResponseMessage PageNotFound()
        {
            return _httpResponseMessageFactory.PageNotFound();
        }
    }
}
