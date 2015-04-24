using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Http;
using easygenerator.Infrastructure.Mail;
using easygenerator.Web.Components.Configuration;
using System;
using System.Linq;
using System.Net;

namespace easygenerator.Web.Components.Tasks
{
    public class HttpRequestsSenderTask : ITask
    {
        private readonly IHttpRequestsRepository _httpRequestsRepository;
        private readonly ConfigurationReader _configurationReader;
        private readonly HttpClient _httpClient;
        private readonly IMailNotificationManager _mailNotificationManager;
        private readonly ILog _logger;

        public HttpRequestsSenderTask(IHttpRequestsRepository httpRequestsRepository, IMailNotificationManager mailNotificationManager, HttpClient httpClient, ConfigurationReader configurationReader, ILog logger)
        {
            _httpRequestsRepository = httpRequestsRepository;
            _configurationReader = configurationReader;
            _httpClient = httpClient;
            _mailNotificationManager = mailNotificationManager;
            _logger = logger;
        }

        public void Execute()
        {
            var httpRequests = _httpRequestsRepository.GetCollection(_configurationReader.HttpRequestsSenderConfiguration.BatchSize,
                _configurationReader.HttpRequestsSenderConfiguration.SendAttemptsLimit);
            if (httpRequests == null || !httpRequests.Any())
            {
                return;
            }

            int sendAttemptsLimit = _configurationReader.HttpRequestsSenderConfiguration.SendAttemptsLimit;

            foreach (var httpRequest in httpRequests)
            {
                if (httpRequest.Verb == WebRequestMethods.Http.Post)
                {
                    try
                    {
                        _httpClient.Post<object>(httpRequest.Url, httpRequest.Content);
                        _httpRequestsRepository.Remove(httpRequest);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogException(ex);
                        httpRequest.IncreaseSendAttempt();

                        if (httpRequest.SendAttempts == sendAttemptsLimit && httpRequest.ReportOnFailure)
                        {
                            _mailNotificationManager.AddMailNotificationToQueue(Constants.MailTemplates.HttpRequestFailedTemplate, httpRequest);
                        }
                    }
                }
                else
                {
                    throw new NotImplementedException("Now only POST verb is supported by HttpRequestsSender. Logic for other verbs has to be implemented.");
                }
            }
        }
    }
}