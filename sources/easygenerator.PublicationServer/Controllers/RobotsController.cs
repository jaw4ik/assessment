using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using easygenerator.PublicationServer.Configuration;

namespace easygenerator.PublicationServer.Controllers
{
    public class RobotsController : BaseApiController
    {
        private readonly ConfigurationReader _configurationReader;

        public RobotsController(ConfigurationReader configurationReader)
        {
            _configurationReader = configurationReader;
        }

        [Route("robots.txt")]
        [HttpGet]
        public HttpResponseMessage RobotsTxt()
        {
            var robotsContent = new StringBuilder();
            robotsContent.AppendLine("User-agent: *");
            var allowIndexing = _configurationReader.AllowIndexing;
            if (allowIndexing)
            {
                robotsContent.AppendLine("Allow: /public/");
            }
            robotsContent.AppendLine("Disallow: /");
            if (allowIndexing)
            {
                robotsContent.AppendLine($"Sitemap: {PublicationServerUri}/sitemapindex.xml");
            }

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(robotsContent.ToString(), Encoding.UTF8, "text/plain")
            };
        }
    }
}
