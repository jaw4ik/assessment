using System;
using System.Net.Http;
using System.Web.Http;
using easygenerator.PublicationServer.DataAccess;
using easygenerator.PublicationServer.HttpResponseMessages;
using easygenerator.PublicationServer.Models;
using easygenerator.PublicationServer.Search;
using easygenerator.PublicationServer.Utils;

namespace easygenerator.PublicationServer.Controllers
{
    public class SearchContentController : BaseApiController
    {

        private readonly PublicationPathProvider _publicationPathProvider;
        private readonly IPublicationRepository _publicationRepository;
        private readonly HttpResponseMessageFactory _httpMessagesFactory;
        private readonly SearchManager _searchManager;

        public SearchContentController(PublicationPathProvider publicationPathProvider, IPublicationRepository publicationRepository,
            SearchManager searchManager, HttpResponseMessageFactory httpMessagesFactory)
        {

            _publicationPathProvider = publicationPathProvider;
            _publicationRepository = publicationRepository;
            _searchManager = searchManager;
            _httpMessagesFactory = httpMessagesFactory;
        }

        [Route(Constants.PublicPublicationsPath + "/{publicPath:searchCrawler}/{*resourcePath}")]
        [HttpGet]
        public HttpResponseMessage SearchContent(string publicPath, string resourcePath)
        {
            if (resourcePath == null)
            {
                if (!Request.RequestUri.AbsolutePath.EndsWith("/"))
                {
                    return _httpMessagesFactory.Redirect(Request.RequestUri.ToString()
                        .Replace(Request.RequestUri.AbsolutePath, $"{Request.RequestUri.AbsolutePath}/"));
                }

                if (!_publicationPathProvider.IsPathToFolder(publicPath))
                {
                    return PublicationResource(Request, publicPath);
                }
            }

            var publication = _publicationRepository.GetByPublicPath(publicPath);
            if (publication != null)
            {
                return PublicationSearchContentResource(publication, resourcePath);
            }

            return PublicationResource(Request, publicPath, resourcePath);
        }

        private HttpResponseMessage PublicationSearchContentResource(Publication publication, string resourcePath)
        {
            if (_searchManager.AllowedToBeIndexed(publication))
            {
                var searchContentResourcePath = _publicationPathProvider.GetSearchContentResourcePath(publication.Id, resourcePath ?? "index.html");
                return _httpMessagesFactory.FileContent(searchContentResourcePath);
            }
            return _httpMessagesFactory.PageNotFound();
        }

        private HttpResponseMessage PublicationResource(HttpRequestMessage request, string publicPath, string resourcePath = null)
        {
            var publicationId = GetPublicationIdFromRequest(request);
            if (publicationId != Guid.Empty)
            {
                var resourceName = resourcePath != null ? $"{publicPath}\\{resourcePath}" : publicPath;
                var courseContentFilePath = _publicationPathProvider.GetPublishedPackagePath(publicationId, resourceName);
                return _httpMessagesFactory.FileContent(courseContentFilePath);
            }
            return _httpMessagesFactory.PageNotFound();
        }

        private Guid GetPublicationIdFromRequest(HttpRequestMessage request)
        {
            var referrer = request.Headers.Referrer;
            if (referrer != null)
            {
                var publicationPublicPath =
                    referrer.AbsolutePath.Replace(Constants.PublicPublicationsPath, "").Replace("/", "");
                var publication = _publicationRepository.GetByPublicPath(publicationPublicPath);
                if (publication != null)
                {
                    return publication.Id;
                }
            }
            return Guid.Empty;
        }
    }
}
