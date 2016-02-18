using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using easygenerator.PublicationServer.DataAccess;
using easygenerator.PublicationServer.FileSystem;
using easygenerator.PublicationServer.Utils;

namespace easygenerator.PublicationServer.Controllers
{
    public class SearchContentController : BaseApiController
    {
        private readonly PhysicalFileManager _physicalFileManager;
        private readonly PublicationPathProvider _publicationPathProvider;
        private readonly IPublicationRepository _publicationRepository;
        private readonly IUserRepository _userRepository;
        private readonly StaticViewContentProvider _contentProvider;

        public SearchContentController(PhysicalFileManager physicalFileManager, PublicationPathProvider publicationPathProvider, IPublicationRepository publicationRepository,
            IUserRepository userRepository, StaticViewContentProvider contentProvider)
        {
            _physicalFileManager = physicalFileManager;
            _publicationPathProvider = publicationPathProvider;
            _publicationRepository = publicationRepository;
            _userRepository = userRepository;
            _contentProvider = contentProvider;
        }

        [Route(Constants.PublicPublicationsPath + "/{publicPath:searchCrawler}/{*resourcePath}", Order = 20)]
        [HttpGet]
        public HttpResponseMessage SearchContent(string publicPath, string resourcePath)
        {
            Guid publicationId;

            if (resourcePath == null)
            {
                if (!_publicationPathProvider.IsPathToFolder(publicPath))
                {
                    publicationId = GetPublicationIdFromRequest(Request);
                    if (publicationId != Guid.Empty)
                    {
                        var courseContentFilePath = _publicationPathProvider.GetPublishedPackagePath(publicationId, $"{publicPath}");
                        return FileResponseMessage(courseContentFilePath);
                    }
                }
                else if (!Request.RequestUri.AbsolutePath.EndsWith("/"))
                {
                    return new HttpResponseMessage(HttpStatusCode.MovedPermanently)
                    {
                        Headers =
                        {
                            Location =
                                new Uri(Request.RequestUri.ToString()
                                    .Replace(Request.RequestUri.AbsolutePath, $"{Request.RequestUri.AbsolutePath}/"))
                        }
                    };
                }
            }

            var publication = _publicationRepository.GetByPublicPath(publicPath);
            if (publication != null)
            {
                var owner = _userRepository.Get(publication.OwnerEmail);
                if (owner != null && owner.AccessType == Constants.Search.SearchableAccessType
                    && (DateTimeWrapper.Now() - owner.ModifiedOn) >
                    TimeSpan.FromDays(Constants.Search.SearchableAccessTypeMinDaysPeriod))
                {
                    var searchContentResourcePath = _publicationPathProvider.GetSearchContentResourcePath(
                        publication.Id,
                        resourcePath ?? "index.html");
                    return FileResponseMessage(searchContentResourcePath);
                }
                return new HtmlPageResponseMessage("404.html", _contentProvider, HttpStatusCode.NotFound);
            }


            publicationId = GetPublicationIdFromRequest(Request);
            if (publicationId != Guid.Empty && !String.IsNullOrWhiteSpace(resourcePath))
            {
                var courseContentFilePath = _publicationPathProvider.GetPublishedPackagePath(publicationId, $"{publicPath}\\{resourcePath}");
                return FileResponseMessage(courseContentFilePath);
            }

            return new HttpResponseMessage(HttpStatusCode.NotFound);
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

        private HttpResponseMessage FileResponseMessage(string filePath)
        {
            if (_physicalFileManager.FileExists(filePath))
            {
                var resourceContent = _physicalFileManager.ReadAllFromFile(filePath);

                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent(resourceContent)
                    {
                        Headers =
                        {
                            ContentType =
                                new MediaTypeHeaderValue(MimeMapping.GetMimeMapping(filePath))
                        }
                    }
                };
            }
            return new HtmlPageResponseMessage("404.html", _contentProvider, HttpStatusCode.NotFound);
        }
    }
}
