using System;
using System.Collections.Specialized;
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

        public virtual NameValueCollection FormData => base.FormData;

        public override string GetLocalFileName(System.Net.Http.Headers.HttpContentHeaders headers)
        {
            return $"{_courseId}.zip";
        }
    }
}
