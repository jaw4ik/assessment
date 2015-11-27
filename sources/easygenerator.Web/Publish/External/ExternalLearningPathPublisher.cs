using System;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Http;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Publish.External
{
    public class ExternalLearningPathPublisher : IExternalLearningPathPublisher
    {
        private readonly HttpClient _httpClient;
        private readonly ILog _logger;

        public ExternalLearningPathPublisher(HttpClient httpClient, ILog logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public bool Publish(LearningPath learningPath, Company company, string userEmail)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(learningPath.PublicationUrl))
                {
                    throw new NotSupportedException(String.Format("Learning path with Id: {0} doesn't have PublicationUrl.", learningPath.Id));
                }

                _httpClient.Post<string>(company.PublishCourseApiUrl, new
                {
                    id = learningPath.Id.ToNString(),
                    userEmail = userEmail,
                    publishedCourseUrl = learningPath.PublicationUrl,
                    apiKey = company.SecretKey
                });

                learningPath.SetPublishedToExternalLms();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogException(e);
                return false;
            }
        }
    }
}