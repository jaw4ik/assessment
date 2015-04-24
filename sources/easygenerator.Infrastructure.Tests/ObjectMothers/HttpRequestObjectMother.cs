using System.Web;
using HttpRequest = easygenerator.Infrastructure.DomainModel.HttpRequest;

namespace easygenerator.Infrastructure.Tests.ObjectMothers
{
    public class HttpRequestObjectMother
    {
        private const string Url = "url";
        private const string Verb = "verb";
        private const string Content = "content";
        private const string ServiceName = "serviceName";
        private const bool Report = true;

        public static HttpRequest Create(string url = Url, string verb = Verb, string content = Content, string serviceName = ServiceName, bool reportOnFailure = Report)
        {
            return new HttpRequest(url, verb, content, serviceName, reportOnFailure);
        }

        public static HttpRequest CreateWithUrl(string url)
        {
            return Create(url: url);
        }

        public static HttpRequest CreateWithVerb(string verb, bool reportOnFailure = false)
        {
            return Create(verb: verb, reportOnFailure: reportOnFailure);
        }

        public static HttpRequest CreateWithContent(string content)
        {
            return Create(content: content);
        }

        public static HttpRequest CreateWithServiceName(string serviceName)
        {
            return Create(serviceName: serviceName);
        }

        public static HttpRequest CreateWithReportOnFailure(bool reportOnFailure)
        {
            return Create(reportOnFailure: reportOnFailure);
        }
    }
}