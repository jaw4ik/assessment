using System.Collections.Generic;
using System.Threading.Tasks;
using HttpClient = easygenerator.Infrastructure.Http.HttpClient;

namespace easygenerator.Web.Publish.Aim4You
{
    public class Aim4YouHttpClient : HttpClient
    {
        public virtual void PostCourseInChunks(string url, string courseId, string fileName, byte[] fileData,
            string userName, string password)
        {
            var fileChunkHeaders = new Dictionary<string, string> { { "CourseId", courseId } };
            base.PostFileInChunks(url, fileName, fileData, userName, password, fileChunkHeaders);
        }

        public virtual void GetWithNoReply(string url, Dictionary<string, string> queryStringParameters, string userName = null, string password = null)
        {
            Task.Run(() => base.Get<string>(url, queryStringParameters, userName, password));
        }
    }
}