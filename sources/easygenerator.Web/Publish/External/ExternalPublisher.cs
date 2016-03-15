using System;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Http;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Publish.External
{
    public class ExternalPublisher : IExternalPublisher
    {
        private readonly HttpClient _httpClient;
        private readonly ILog _logger;

        public ExternalPublisher(HttpClient httpClient, ILog logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public bool Publish<T>(T entity, Company company, string userEmail) where T : IPublishableEntity
        {
            try
            {
                if (string.IsNullOrWhiteSpace(entity.PublicationUrl))
                {
                    throw new InvalidOperationException($"Entity was not published (PublicationUrl is empty). Entity id: {entity.Id}.");
                }

                _httpClient.Post(company.PublishCourseApiUrl, new
                {
                    id = entity.Id.ToNString(),
                    userEmail = userEmail,
                    publishedCourseUrl = entity.PublicationUrl,
                    apiKey = company.SecretKey
                });

                entity.SetPublishedToExternalLms(company);

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