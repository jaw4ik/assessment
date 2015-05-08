using System;
using System.Net.Http;

namespace easygenerator.PublicationServer.MultipartFormData
{
    public class CourseMultipartFormDataStreamProvider : MultipartFormDataStreamProvider
    {
        private readonly string _courseId;
        public CourseMultipartFormDataStreamProvider(string rootPath, string courseId)
            : base(rootPath)
        {
            _courseId = courseId;
        }

        public override string GetLocalFileName(System.Net.Http.Headers.HttpContentHeaders headers)
        {
            return string.Format("{0}.zip", _courseId);
        }
    }
}
