using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using easygenerator.PublicationServer.FileSystem;

namespace easygenerator.PublicationServer.HttpResponseMessages
{
    public class HttpResponseMessageFactory
    {
        private readonly StaticViewContentProvider _contentProvider;
        private readonly PhysicalFileManager _physicalFileManager;

        public HttpResponseMessageFactory(StaticViewContentProvider contentProvider, PhysicalFileManager physicalFileManager)
        {
            _contentProvider = contentProvider;
            _physicalFileManager = physicalFileManager;
        }

        public HttpResponseMessage FileContent(string filePath)
        {
            if (_physicalFileManager.FileExists(filePath))
            {
                var resourceContent = _physicalFileManager.ReadAllFromFile(filePath);

                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent(resourceContent)
                    {
                        Headers =
                        {
                            ContentType =
                                new MediaTypeHeaderValue(MimeMapping.GetMimeMapping(filePath))
                        }
                    }
                };
            }
            return PageNotFound();
        }

        public HttpResponseMessage HtmlPage(string pagePath, HttpStatusCode httpStatusCode)
        {
            return new HtmlPageResponseMessage(pagePath, _contentProvider, httpStatusCode);
        }

        public HttpResponseMessage Redirect(string url)
        {
            return new HttpResponseMessage(HttpStatusCode.MovedPermanently)
            {
                Headers = { Location = new Uri(url) }
            };
        }

        public HttpResponseMessage PageNotFound()
        {
            return new HtmlPageResponseMessage("404.html", _contentProvider, HttpStatusCode.NotFound);
        }

        public HttpResponseMessage InternalServerError()
        {
            return new HtmlPageResponseMessage("500.html", _contentProvider, HttpStatusCode.InternalServerError);
        }

        public HttpResponseMessage Maintenance()
        {
            return new HtmlPageResponseMessage("maintenance.html", _contentProvider, HttpStatusCode.ServiceUnavailable);
        }
    }
}
