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
        private readonly ConfigurationReader _configurationReader;
        public SystemPagesController(StaticViewContentProvider contentProvider, ConfigurationReader configurationReader)
        {
            _contentProvider = contentProvider;
            _configurationReader = configurationReader;
        }

        [Route("~/")]
        [HttpGet]
        public IHttpActionResult HomePageRedirect()
        {
            if (!String.IsNullOrWhiteSpace(_configurationReader.HomePageRedirectUrl))
            {
                return Redirect(_configurationReader.HomePageRedirectUrl);
            }
            return Redirect($"{PublicationServerUri}/404");
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
