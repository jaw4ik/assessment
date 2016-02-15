using System;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Http;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Publish.External
{
    public class ExternalCoursePublisher : IExternalCoursePublisher
    {
        private readonly HttpClient _httpClient;
        private readonly ILog _logger;

        public ExternalCoursePublisher(HttpClient httpClient, ILog logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public bool PublishCourseUrl(Course course, Company company, string userEmail)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(course.PublicationUrl))
                {
                    throw new Exception("Course is already not published.");
                }

                _httpClient.Post(company.PublishCourseApiUrl, new
                {
                    id = course.Id.ToNString(),
                    userEmail = userEmail,
                    publishedCourseUrl = course.PublicationUrl,
                    apiKey = company.SecretKey
                });

                course.SetPublishedToExternalLms(company);
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