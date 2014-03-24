using System.Collections.Generic;
using easygenerator.Infrastructure.Http;

namespace easygenerator.Web.Publish.Aim4You
{
    public class Aim4YouHttpClient : HttpClient
    {
        public virtual void PostCourseInChunks(string url, string courseId, string fileName, byte[] fileData,
            string userName = null, string password = null)
        {
            var fileChunkHeaders = new Dictionary<string, string> { { "CourseId", courseId } };
            base.PostFileInChunks(url, fileName, fileData, userName, password, fileChunkHeaders);
        }
    }
}