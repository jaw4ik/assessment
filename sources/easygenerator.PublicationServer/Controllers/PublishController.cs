using System;
using easygenerator.PublicationServer.ActionFilters;
using easygenerator.PublicationServer.MultipartFormData;
using easygenerator.PublicationServer.Publish;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace easygenerator.PublicationServer.Controllers
{
    [ExternalApiAuthorize]
    public class PublishController : ApiController
    {
        private readonly ICoursePublisher _coursePublisher;
        private readonly IPublishDispatcher _courseDispatcher;
        private readonly CourseMultipartFormDataManager _courseDataManager;

        public string PublicationServerUri
        {
            get
            {
                return Request.RequestUri.GetLeftPart(UriPartial.Authority);
            }
        }

        public PublishController(ICoursePublisher coursePublisher, CourseMultipartFormDataManager courseDataManager, IPublishDispatcher publishDispatcher)
        {
            _coursePublisher = coursePublisher;
            _courseDataManager = courseDataManager;
            _courseDispatcher = publishDispatcher;
        }

        [HttpPost]
        public async Task<HttpResponseMessage> PublishCourse(string courseId)
        {
            if (string.IsNullOrEmpty(courseId))
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Course id cannot be empty.");
            }
            if (_courseDispatcher.IsPublishing(courseId))
            {
                return Request.CreateResponse(HttpStatusCode.ServiceUnavailable, string.Format("Course '{0}' is already publishing.", courseId));
            }

            await _courseDataManager.SaveCourseDataAsync(Request, courseId);
            return _coursePublisher.PublishCourse(courseId) ?
                Request.CreateResponse(HttpStatusCode.OK, GetPublishedCourseUri(courseId)) :
                Request.CreateResponse(HttpStatusCode.InternalServerError, string.Format("Publication failed for course '{0}'. Please try again.", courseId));
        }

        private string GetPublishedCourseUri(string courseId)
        {
            return string.Format("{0}/{1}", PublicationServerUri, courseId);
        }
    }
}
