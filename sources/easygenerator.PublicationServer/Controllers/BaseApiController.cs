using System;
using System.Web.Http;

namespace easygenerator.PublicationServer.Controllers
{
    public abstract class BaseApiController : ApiController
    {
        public Uri PageNotFoundUri => new Uri($"{PublicationServerUri}/404");

        public string PublicationServerUri => Request.RequestUri.GetLeftPart(UriPartial.Authority);
    }
}
