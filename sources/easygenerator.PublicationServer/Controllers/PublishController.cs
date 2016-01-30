using System;
using easygenerator.PublicationServer.ActionFilters;
using easygenerator.PublicationServer.MultipartFormData;
using easygenerator.PublicationServer.Publish;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using easygenerator.PublicationServer.DataAccess;
using easygenerator.PublicationServer.Extensions;
using easygenerator.PublicationServer.Models;

namespace easygenerator.PublicationServer.Controllers
{
    [ExternalApiAuthorize]
    public class PublishController : BaseApiController
    {
        private readonly ICoursePublisher _coursePublisher;
        private readonly IPublishDispatcher _courseDispatcher;
        private readonly CourseMultipartFormDataManager _courseDataManager;
        private readonly IPublicationRepository _publicationRepository;
        private readonly HttpUtilityWrapper _httpUtilityWrapper;

        public PublishController(ICoursePublisher coursePublisher, CourseMultipartFormDataManager courseDataManager, IPublishDispatcher publishDispatcher, IPublicationRepository publicationRepository,
            HttpUtilityWrapper httpUtilityWrapper)
        {
            _coursePublisher = coursePublisher;
            _courseDataManager = courseDataManager;
            _courseDispatcher = publishDispatcher;
            _publicationRepository = publicationRepository;
            _httpUtilityWrapper = httpUtilityWrapper;
        }

        [Route("api/publish/{courseId}")]
        [HttpPost]
        public async Task<HttpResponseMessage> PublishCourse(Guid courseId)
        {
            if (courseId.Equals(Guid.Empty))
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Course id cannot be empty.");
            }

            if (_courseDispatcher.IsPublishing(courseId))
            {
                return Request.CreateResponse(HttpStatusCode.ServiceUnavailable, $"Course '{courseId}' is already publishing.");
            }

            var formDataProvider = await _courseDataManager.SaveCourseDataAsync(Request, courseId);
            var ownerEmail = formDataProvider.FormData.GetValue("ownerEmail");
            if (string.IsNullOrWhiteSpace(ownerEmail))
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Owner email cannot be null or whitespace.");
            }

            var title = formDataProvider.FormData.GetValue("title");
            if (string.IsNullOrWhiteSpace(title))
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Title cannot be null or whitespace.");
            }

            DateTime createdDate;
            if (!DateTime.TryParse(formDataProvider.FormData.GetValue("createdDate"), out createdDate))
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Created date cannot be parsed.");
            }

            if (_coursePublisher.PublishCourse(courseId))
            {
                var currentPublication = _publicationRepository.Get(courseId);
                if (currentPublication == null)
                {
                    var publicPath = $"public/{createdDate.ToString("yyyy-MM-dd")}-{_httpUtilityWrapper.UrlEncode(title)}/";
                    _publicationRepository.Add(new Publication(courseId, ownerEmail, publicPath));
                }
                else
                {
                    currentPublication.MarkAsModified();
                    _publicationRepository.Update(currentPublication);
                }
                return Request.CreateResponse(HttpStatusCode.OK, GetPublishedCourseUri(courseId));
            }

            return Request.CreateResponse(HttpStatusCode.InternalServerError, $"Publication failed for course '{courseId}'. Please try again.");
        }

        private string GetPublishedCourseUri(Guid courseId)
        {
            return $"{PublicationServerUri}/{courseId}";
        }
    }
}
;