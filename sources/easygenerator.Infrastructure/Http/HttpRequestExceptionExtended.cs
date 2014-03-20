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

        public HttpRequestExceptionExtended(string requestUrl, string requestContent, HttpResponseMessage responseMessage)
            : base(string.Format("An error occurred while sending the request. Response status: {0}, Reason: {1}.", (int)responseMessage.StatusCode, responseMessage.ReasonPhrase))
        {
            RequestUrl = requestUrl;
            RequestContent = requestContent;
            ResponseStatusCode = responseMessage.StatusCode;
            ReasonPhrase = responseMessage.ReasonPhrase;
            ResponseBody = responseMessage.Content.ReadAsStringAsync().Result;

            // add these values to data collection to log them in elmah.
            Data.Add("Request data", responseMessage.RequestMessage.ToString());
            Data.Add("Request content", requestContent);
            Data.Add("Response status", (int)ResponseStatusCode);
            Data.Add("Response reason phrase", ReasonPhrase);
            Data.Add("Response body", ResponseBody);
        }
    }
}