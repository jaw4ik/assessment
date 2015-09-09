using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Http;

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

                _httpClient.Post<string>(GetExternalApiUrl(company), new
                {
                    id = course.Id,
                    userEmail = userEmail,
                    publishedCourseUrl = course.PublicationUrl
                });

                course.SetPublishedToExternalLms(true);
                return true;
            }
            catch (HttpRequestExceptionExtended e)
            {
                _logger.LogException(e);
                return false;
            }
        }

        private string GetExternalApiUrl(Company company)
        {
            return String.Format("{0}?key={1}", company.PublishCourseApiUrl, company.SecretKey);
        }
    }
}