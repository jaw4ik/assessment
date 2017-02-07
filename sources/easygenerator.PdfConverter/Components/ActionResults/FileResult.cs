using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Filters;

namespace easygenerator.PdfConverter.Components.ActionResults
{
    public class FileResult : IHttpActionResult
    {
        private readonly string _filePath;
        private readonly byte[] _fileBytes;
        private readonly string _contentType;

        public FileResult(string filePath, string contentType = null)
        {
            if (filePath == null) throw new ArgumentNullException(nameof(filePath));

            _filePath = filePath;
            _contentType = contentType;
        }

        public FileResult(byte[] fileBytes, string contentType = null)
        {
            if (fileBytes == null) throw new ArgumentNullException(nameof(fileBytes));

            _fileBytes = fileBytes;
            _contentType = contentType;
        }

        public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
        {
            var response = new HttpResponseMessage(HttpStatusCode.OK);
            string contentType = "";

            if (_filePath != null)
            {
                response.Content = new StreamContent(File.OpenRead(_filePath));
                contentType = _contentType ?? MimeMapping.GetMimeMapping(Path.GetExtension(_filePath));
            }
            else
            {
                response.Content = new StreamContent(new MemoryStream(_fileBytes));
                contentType = _contentType ?? "application/pdf";
            }

            response.Content.Headers.ContentType = new MediaTypeHeaderValue(contentType);

            return Task.FromResult(response);
        }
    }
}