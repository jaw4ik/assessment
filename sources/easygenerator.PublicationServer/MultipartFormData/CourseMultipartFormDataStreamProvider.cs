using System;
using System.Net.Http;

namespace easygenerator.PublicationServer.MultipartFormData
{
    public class CourseMultipartFormDataStreamProvider : MultipartFormDataStreamProvider
    {
        private readonly Guid _courseId;
        public CourseMultipartFormDataStreamProvider(string rootPath, Guid courseId)
            : base(rootPath)
        {
            _courseId = courseId;
        }

        public override string GetLocalFileName(System.Net.Http.Headers.HttpContentHeaders headers)
        {
            return $"{_courseId}.zip";
        }
    }
}
