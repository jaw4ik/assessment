using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Mime;
using System.Web;
using System.Web.Http.Filters;

namespace easygenerator.PdfConverter.Components.Attributes
{
    public class FileNameAttribute : ActionFilterAttribute
    {
        private const string FILE_NAME_URL_PARAM = "filename";
        public string FileName { get; set; }

        public FileNameAttribute(string fileName = null)
        {
            FileName = fileName;
        }

        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            CheckAndHandleFileName(actionExecutedContext);

            base.OnActionExecuted(actionExecutedContext);
        }

        private void CheckAndHandleFileName(HttpActionExecutedContext actionExecutedContext)
        {
            var response = actionExecutedContext.Response;

            if (response.Content is StreamContent)
            {
                var queryString = actionExecutedContext.Request.GetQueryNameValuePairs();
                var contentDisposition = new ContentDisposition() { Inline = false };

                var fileNameQueryStringParam = queryString.FirstOrDefault(i => i.Key == FILE_NAME_URL_PARAM);
                if (fileNameQueryStringParam.Value != null)
                {
                    contentDisposition.FileName = fileNameQueryStringParam.Value + GetFileExtension(response.Content.Headers.ContentType?.MediaType);
                }
                else if (FileName != null)
                {
                    contentDisposition.FileName = FileName + GetFileExtension(response.Content.Headers.ContentType?.MediaType);
                }

                response.Content.Headers.Add("Content-Disposition", contentDisposition.ToString());
            }
        }

        private string GetFileExtension(string mediaType)
        {
            return mediaType != null
                ? $".{mediaType.Substring(mediaType.LastIndexOf('/') + 1)}"
                : String.Empty;
        }
    }
}