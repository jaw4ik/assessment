using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
namespace easygenerator.PublicationServer.MultipartFormData
{
    public class CourseMultipartFormDataManager
    {
        private readonly PublicationPathProvider _publishPathProvider;

        public CourseMultipartFormDataManager(PublicationPathProvider publishPathProvider)
        {
            _publishPathProvider = publishPathProvider;
        }

        public virtual Task<CourseMultipartFormDataStreamProvider> SaveCourseDataAsync(HttpRequestMessage request, string courseId)
        {
            if (!request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            var provider = new CourseMultipartFormDataStreamProvider(_publishPathProvider.GetUploadedPackagesFolderPath(), courseId);

            return request.Content.ReadAsMultipartAsync(provider);
        }
    }
}
