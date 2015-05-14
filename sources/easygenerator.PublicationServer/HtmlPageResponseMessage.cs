using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;

namespace easygenerator.PublicationServer
{
    public class HtmlPageResponseMessage : HttpResponseMessage
    {
        public HtmlPageResponseMessage(string htmlPageName, StaticViewContentProvider contentProvider, HttpStatusCode htmlStatusCode)
        {
            Content = new StringContent(contentProvider.GetViewContent(htmlPageName));
            Content.Headers.ContentType = new MediaTypeHeaderValue("text/html");
            StatusCode = htmlStatusCode;
        }
    }
}
