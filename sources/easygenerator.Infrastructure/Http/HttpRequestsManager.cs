using easygenerator.Infrastructure.DomainModel;
using easygenerator.Infrastructure.Mail;
using Newtonsoft.Json;
using System;
using System.Net;

namespace easygenerator.Infrastructure.Http
{
    public class HttpRequestsManager : IHttpRequestsManager
    {
        private readonly IHttpRequestsRepository _httpRequestsRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly HttpClient _httpClient;
        private readonly ILog _logger;
        private readonly IMailNotificationManager _mailNotificationManager;

        public HttpRequestsManager(IHttpRequestsRepository httpRequestsRepository, IUnitOfWork unitOfWork, HttpClient httpClient, ILog logger, IMailNotificationManager mailNotificationManager)
        {
            _httpRequestsRepository = httpRequestsRepository;
            _unitOfWork = unitOfWork;
            _httpClient = httpClient;
            _logger = logger;
            _mailNotificationManager = mailNotificationManager;
        }

        public virtual void PostOrAddToQueueIfUnexpectedError(string url, object postData, string serviceName, bool reportOnFailure = true)
        {
            try
            {
                _httpClient.Post<string>(url, postData);
            }
            catch (Exception exception)
            {
                _logger.LogException(exception);

                if (IsUnexpectedError(exception))
                {
                    AddHttpRequestToQueue(url, WebRequestMethods.Http.Post, postData, serviceName, reportOnFailure);
                }
                else if (reportOnFailure)
                {
                    _mailNotificationManager.AddMailNotificationToQueue(Constants.MailTemplates.HttpRequestFailedTemplate,
                               new { ServiceName = serviceName, Url = url, Verb = WebRequestMethods.Http.Post, Content = JsonConvert.SerializeObject(postData), SendAttempts = 0 });
                }
            }
        }

        protected virtual void AddHttpRequestToQueue(string url, string verb, object postJsonData, string serviceName, bool reportOnFailure = true)
        {
            _httpRequestsRepository.Add(new HttpRequest(url, verb, JsonConvert.SerializeObject(postJsonData), serviceName, reportOnFailure));
            _unitOfWork.Save();
        }

        protected virtual bool IsUnexpectedError(Exception exception)
        {
            var htppRequestException = exception as HttpRequestExceptionExtended;
            return htppRequestException == null ||
                   htppRequestException.ResponseStatusCode < HttpStatusCode.BadRequest &&
                   htppRequestException.ResponseStatusCode >= HttpStatusCode.InternalServerError;
        }
    }
}