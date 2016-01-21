using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using easygenerator.PublicationServer.Configuration;
using easygenerator.PublicationServer.DataAccess;
using easygenerator.PublicationServer.Models;

namespace easygenerator.PublicationServer.Controllers
{
    public class SeoController : ApiController
    {
        private readonly IPublicationRepository _publicationRepository;
        private readonly IUserRepository _userRepository;
        private readonly ConfigurationReader _configurationReader;

        private const int SitemapMaxUrlsCount = 10000;
        private const int PublicationsBatch = 1000;
        private const AccessType SearchableAccessType = AccessType.Free;
        private const int SearchableAccessTypeMinDaysPeriod = 14;
        private Uri PageNotFoundUri => new Uri($"{PublicationServerUri}/404");

        private string PublicationServerUri => Request.RequestUri.GetLeftPart(UriPartial.Authority);

        public SeoController(IPublicationRepository publicationRepository, IUserRepository userRepository, ConfigurationReader configurationReader)
        {
            _publicationRepository = publicationRepository;
            _userRepository = userRepository;
            _configurationReader = configurationReader;
        }

        public IHttpActionResult GetIndexableContent(Guid courseId)
        {
            return Redirect($"{PublicationServerUri}/{courseId}/{_configurationReader.IndexingContentFolder}/");
        }

        [Route("public/{searchId}")]
        public IHttpActionResult GetSearchablePublication(Guid searchId)
        {
            var publication = _publicationRepository.GetBySearchId(searchId);
            if (publication != null)
            {
                var owner = _userRepository.Get(publication.OwnerEmail);
                if (owner != null && owner.AccessType == AccessType.Free && DateTimeWrapper.Now() - owner.ModifiedOn > TimeSpan.FromDays(14))
                {
                    return Redirect($"{PublicationServerUri}/{publication.Id}/");
                }
            }

            return Redirect(PageNotFoundUri);
        }

        [Route("sitemapindex.xml")]
        public HttpResponseMessage GetSitemapIndex()
        {
            var publicationsCount = _publicationRepository.GetPublicationsCountForUsersWithAccessType(SearchableAccessType, SearchableAccessTypeMinDaysPeriod);
            var sitemapFilesCounts = (int)Math.Ceiling((double)publicationsCount / SitemapMaxUrlsCount);

            if (sitemapFilesCounts > 0)
            {
                var sitemapIndexContentBuilder = new StringBuilder();
                sitemapIndexContentBuilder.Append(
                    "<?xml version=\"1.0\" encoding=\"UTF-8\"?><sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");

                for (int i = 0; i < sitemapFilesCounts; i++)
                {
                    sitemapIndexContentBuilder.AppendFormat($"<sitemap><loc>{PublicationServerUri}/sitemap_{i + 1}.xml</loc></sitemap>");
                }

                sitemapIndexContentBuilder.Append("</sitemapindex>");

                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent(sitemapIndexContentBuilder.ToString(), Encoding.UTF8, "text/xml")
                };
            }

            return new HttpResponseMessage(HttpStatusCode.TemporaryRedirect)
            {
                Headers = { Location = PageNotFoundUri }
            };
        }

        [Route("sitemap_{index}.xml")]
        public HttpResponseMessage GetSitemap(int index)
        {
            var processedPublicationsCount = 0;
            var sitemapContentBuilder = new StringBuilder();
            sitemapContentBuilder.Append(
                "<?xml version=\"1.0\" encoding=\"utf-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd\">");

            while (processedPublicationsCount < SitemapMaxUrlsCount)
            {
                var searchablePublications = _publicationRepository.GetPublicationsForUsersWithAccessType(SearchableAccessType, SearchableAccessTypeMinDaysPeriod, PublicationsBatch,
                    ((index - 1) * SitemapMaxUrlsCount) + processedPublicationsCount);

                if (searchablePublications == null || searchablePublications.Count == 0)
                {
                    break;
                }

                foreach (var publication in searchablePublications)
                {
                    sitemapContentBuilder.Append($"<url><loc>{PublicationServerUri}/public/{publication.SearchId}/</loc><lastmod>{publication.ModifiedOn.ToString("yyyy-MM-ddTHH:mmzzz")}</lastmod></url>");
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

            return new HttpResponseMessage(HttpStatusCode.TemporaryRedirect)
            {
                Headers = { Location = PageNotFoundUri }
            };
        }
    }
}
