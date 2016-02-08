using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using easygenerator.PublicationServer.DataAccess;

namespace easygenerator.PublicationServer.Controllers
{
    public class SitemapController : BaseApiController
    {
        private const int SitemapMaxUrlsCount = 10000;
        private const int PublicationsBatch = 1000;


        private readonly IPublicationRepository _publicationRepository;
        public SitemapController(IPublicationRepository publicationRepository)
        {
            _publicationRepository = publicationRepository;
        }

        [Route(Constants.PublicPublicationsPath + "/sitemapindex.xml")]
        [HttpGet]
        public HttpResponseMessage SitemapIndex()
        {
            var publicationsCount = _publicationRepository.GetPublicationsCountForUsersWithAccessType(Constants.Search.SearchableAccessType, Constants.Search.SearchableAccessTypeMinDaysPeriod);
            var sitemapFilesCounts = (int)Math.Ceiling((double)publicationsCount / SitemapMaxUrlsCount);

            if (sitemapFilesCounts > 0)
            {
                var sitemapIndexContentBuilder = new StringBuilder();
                sitemapIndexContentBuilder.Append(
                    "<?xml version=\"1.0\" encoding=\"UTF-8\"?><sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");

                for (int i = 0; i < sitemapFilesCounts; i++)
                {
                    sitemapIndexContentBuilder.AppendFormat($"<sitemap><loc>{PublicationServerUri}/{Constants.PublicPublicationsPath}/sitemap_{i + 1}.xml</loc></sitemap>");
                }

                sitemapIndexContentBuilder.Append("</sitemapindex>");

                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent(sitemapIndexContentBuilder.ToString(), Encoding.UTF8, "text/xml")
                };
            }

            return new HttpResponseMessage(HttpStatusCode.NotFound);
        }

        [Route(Constants.PublicPublicationsPath + "/sitemap_{index}.xml")]
        [HttpGet]
        public HttpResponseMessage Sitemap(int index)
        {
            var processedPublicationsCount = 0;
            var sitemapContentBuilder = new StringBuilder();
            sitemapContentBuilder.Append(
                "<?xml version=\"1.0\" encoding=\"utf-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd\">");

            while (processedPublicationsCount < SitemapMaxUrlsCount)
            {
                var searchablePublications = _publicationRepository.GetPublicationsForUsersWithAccessType(Constants.Search.SearchableAccessType, Constants.Search.SearchableAccessTypeMinDaysPeriod, PublicationsBatch,
                    ((index - 1) * SitemapMaxUrlsCount) + processedPublicationsCount);

                if (searchablePublications == null || searchablePublications.Count == 0)
                {
                    break;
                }

                foreach (var publication in searchablePublications)
                {
                    sitemapContentBuilder.Append($"<url><loc>{PublicationServerUri}/{Constants.PublicPublicationsPath}/{publication.PublicPath}/</loc><lastmod>{publication.ModifiedOn.ToString("yyyy-MM-ddTHH:mmzzz")}</lastmod></url>");
                }

                processedPublicationsCount += searchablePublications.Count;
            }

            sitemapContentBuilder.Append("</urlset>");

            if (processedPublicationsCount > 0)
            {
                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent(sitemapContentBuilder.ToString(), Encoding.UTF8, "text/xml")
                };
            }

            return new HttpResponseMessage(HttpStatusCode.NotFound);
        }
    }
}
