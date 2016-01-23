using System;
using easygenerator.PublicationServer.ActionFilters;
using easygenerator.PublicationServer.MultipartFormData;
using easygenerator.PublicationServer.Publish;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using easygenerator.PublicationServer.DataAccess;
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

        public PublishController(ICoursePublisher coursePublisher, CourseMultipartFormDataManager courseDataManager, IPublishDispatcher publishDispatcher, IPublicationRepository publicationRepository)
        {
            _coursePublisher = coursePublisher;
            _courseDataManager = courseDataManager;
            _courseDispatcher = publishDispatcher;
            _publicationRepository = publicationRepository;
        }

        [HttpPost]
        public async Task<HttpResponseMessage> PublishCourse(Guid courseId, string ownerEmail)
        {
            if (courseId.Equals(Guid.Empty))
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Course id cannot be empty.");
            }
            if (string.IsNullOrWhiteSpace(ownerEmail))
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Owner email cannot be null or whitespace.");
            }
            if (_courseDispatcher.IsPublishing(courseId))
            {
                return Request.CreateResponse(HttpStatusCode.ServiceUnavailable, $"Course '{courseId}' is already publishing.");
            }

            await _courseDataManager.SaveCourseDataAsync(Request, courseId);
            if (_coursePublisher.PublishCourse(courseId))
            {
                var currentPublication = _publicationRepository.Get(courseId);
                if (currentPublication == null)
                {
                    _publicationRepository.Add(new Publication(courseId, ownerEmail));
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
