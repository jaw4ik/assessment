using System.Net;
using System.Net.Http;

namespace easygenerator.Infrastructure.Http
{
    public sealed class HttpRequestExceptionExtended : HttpRequestException
    {
        public string RequestUrl { get; private set; }
        public string RequestContent { get; private set; }
        public HttpStatusCode ResponseStatusCode { get; private set; }
        public string ReasonPhrase { get; private set; }
        public string ResponseBody { get; private set; }

        public HttpRequestExceptionExtended(string requestUrl, string requestContent, string requestData, HttpStatusCode responseStatusCode, string reasonPhrase, string responseBody)
            : base(string.Format("An error occurred while sending the request. Response status: {0}, Reason: {1}.", (int)responseStatusCode, reasonPhrase))
        {
            RequestUrl = requestUrl;
            RequestContent = requestContent;
            ResponseStatusCode = responseStatusCode;
            ReasonPhrase = reasonPhrase;
            ResponseBody = responseBody;

            // add these values to data collection to log them in elmah.
            Data.Add("Request data", requestData);
            Data.Add("Request content", requestContent);
            Data.Add("Response status", responseStatusCode);
            Data.Add("Response reason phrase", reasonPhrase);
            Data.Add("Response body", responseBody);
        }
    }
}