using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using easygenerator.PublicationServer.DataAccess;
using easygenerator.PublicationServer.FileSystem;
using easygenerator.PublicationServer.Models;

namespace easygenerator.PublicationServer.Controllers
{
    public class SearchContentController : BaseApiController
    {
        private readonly IPublicationRepository _publicationRepository;
        private readonly IUserRepository _userRepository;
        private readonly PhysicalFileManager _physicalFileManager;
        private readonly PublicationPathProvider _publicationPathProvider;

        public SearchContentController(IPublicationRepository publicationRepository, IUserRepository userRepository, PhysicalFileManager physicalFileManager,
            PublicationPathProvider publicationPathProvider)
        {
            _publicationRepository = publicationRepository;
            _userRepository = userRepository;
            _physicalFileManager = physicalFileManager;
            _publicationPathProvider = publicationPathProvider;
        }

        [Route("{courseId:guid:seofragment}/{*resourcePath}", Order = 10)]
        [HttpGet]
        public HttpResponseMessage SearchContent(Guid courseId, string resourcePath)
        {
            if (resourcePath == null && !Request.RequestUri.AbsolutePath.EndsWith("/"))
            {
                return new HttpResponseMessage(HttpStatusCode.MovedPermanently)
                {
                    Headers = { Location = new Uri(Request.RequestUri.ToString().Replace(Request.RequestUri.AbsolutePath, $"{Request.RequestUri.AbsolutePath}/")) }
                };
            }

            var searchContentResourcePath = _publicationPathProvider.GetSearchContentResourcePath(courseId, resourcePath ?? "index.html");
            return FileResponseMessage(searchContentResourcePath);
        }

        [Route("{*resourcePath:seofragment}", Order = 20)]
        [HttpGet]
        public HttpResponseMessage SearchContent(string resourcePath)
        {
            var referrer = Request.Headers.Referrer;
            if (referrer != null && !String.IsNullOrWhiteSpace(resourcePath))
            {
                var courseIdStr = referrer.AbsolutePath.Replace("/", "");
                Guid courseId;
                if (Guid.TryParse(courseIdStr, out courseId))
                {
                    var courseContentFilePath = _publicationPathProvider.GetPublishedPackagePath(courseId, resourcePath.Replace("/", "\\"));
                    return FileResponseMessage(courseContentFilePath);
                }
            }
            return new HttpResponseMessage(HttpStatusCode.NotFound);
        }

        [Route("public/{searchId:guid}")]
        [HttpGet]
        public IHttpActionResult SearchablePublication(Guid searchId)
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
            return new HttpResponseMessage(HttpStatusCode.NotFound);
        }
    }
}
