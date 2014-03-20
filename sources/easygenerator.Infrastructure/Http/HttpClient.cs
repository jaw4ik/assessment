using easygenerator.Infrastructure.Mail;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Net.Http;
using System.Text;

namespace easygenerator.Infrastructure.Http
{
    public class HttpClient
    {
        private readonly IMailNotificationManager _mailNotificationManager;
        private readonly IHttpRequestsManager _httpRequestsManager;
        private readonly ILog _logger;

        public HttpClient(IMailNotificationManager mailNotificationManager, IHttpRequestsManager httpRequestsManager, ILog log)
        {
            _mailNotificationManager = mailNotificationManager;
            _httpRequestsManager = httpRequestsManager;
            _logger = log;
        }

        public virtual void PostOrAddToQueueIfUnexpectedError(string url, object postData, string serviceName, bool reportOnFailure = true)
        {
            try
            {
                Post<string>(url, postData);
            }
            catch (Exception exception)
            {
                _logger.LogException(exception);

                if (IsUnexpectedError(exception))
                {
                    _httpRequestsManager.AddHttpRequestToQueue(url, WebRequestMethods.Http.Post, JsonConvert.SerializeObject(postData), serviceName, reportOnFailure);
                }
                else if (reportOnFailure)
                {
                    _mailNotificationManager.AddMailNotificationToQueue(Constants.MailTemplates.HttpRequestFailedTemplate,
                               new { ServiceName = serviceName, Url = url, Verb = WebRequestMethods.Http.Post, Content = JsonConvert.SerializeObject(postData), SendAttempts = 0 });
                }
            }
        }

        protected virtual bool IsUnexpectedError(Exception exception)
        {
            var htppRequestException = exception as HttpRequestExceptionExtended;
            return htppRequestException == null ||
                   htppRequestException.ResponseStatusCode < HttpStatusCode.BadRequest &&
                   htppRequestException.ResponseStatusCode >= HttpStatusCode.InternalServerError;
        }

        #region [ Instantly send request methods ]

        public virtual TResponse Post<TResponse>(string url, object postData)
        {
            return Post<TResponse>(url, JsonConvert.SerializeObject(postData));
        }

        public virtual TResponse Post<TResponse>(string url, string postJsonData)
        {
            using (var client = new System.Net.Http.HttpClient(new HttpClientHandler() { UseProxy = false }))
            {
                HttpResponseMessage response = client.PostAsync(url, new StringContent(postJsonData, Encoding.UTF8, "application/json")).Result;

                if (!response.IsSuccessStatusCode)
                {
                    throw new HttpRequestExceptionExtended(url, postJsonData, response);
                }

                string responseBody = response.Content.ReadAsStringAsync().Result;
                return JsonConvert.DeserializeObject<TResponse>(responseBody);
            }
        }

        #endregion
    }
}
