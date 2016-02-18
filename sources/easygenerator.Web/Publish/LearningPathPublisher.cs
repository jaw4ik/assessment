using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Http;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.Components.Configuration;
using System;
using System.Collections.Generic;
using System.Globalization;
using easygenerator.Web.Components;

namespace easygenerator.Web.Publish
{
    public class LearningPathPublisher : ILearningPathPublisher
    {
        private readonly ILog _logger;
        private readonly IUrlHelperWrapper _urlHelper;
        private readonly PhysicalFileManager _fileManager;
        private readonly BuildPathProvider _pathProvider;
        private readonly HttpClient _httpClient;
        private readonly ConfigurationReader _configurationReader;

        public LearningPathPublisher(IUrlHelperWrapper urlHelper, ILog logger, PhysicalFileManager fileManager, BuildPathProvider pathProvider, HttpClient httpClient, ConfigurationReader configurationReader)
        {
            _urlHelper = urlHelper;
            _logger = logger;
            _fileManager = fileManager;
            _pathProvider = pathProvider;
            _httpClient = httpClient;
            _configurationReader = configurationReader;
        }

        public bool Publish(LearningPath learningPath)
        {
            try
            {
                if (String.IsNullOrEmpty(learningPath.PackageUrl))
                {
                    throw new NotSupportedException(
                        $"Publishing of non builded learning path is not supported. LearningPathId: {learningPath.Id}");
                }

                var package = _fileManager.GetFileBytes(_pathProvider.GetBuildedPackagePath(learningPath.PackageUrl));
                var packageId = learningPath.Id.ToString();

                var publishMethodPath = _urlHelper.AddCurrentSchemeToUrl($"{_configurationReader.PublicationConfiguration.ServiceUrl}/api/publish/{packageId}");
                var publicationUrl = _httpClient.PostFile<string>(
                        publishMethodPath,
                        packageId,
                        package,
                        formValues: new[] {
                                            new KeyValuePair<string, string>("ownerEmail", learningPath.CreatedBy),
                                            new KeyValuePair<string, string>("title", learningPath.Title),
                                            new KeyValuePair<string, string>("createdDate", learningPath.CreatedOn.ToString(CultureInfo.InvariantCulture))
                        },
                        headerValues: new[] {
                                            new KeyValuePair<string, string>("key", _configurationReader.PublicationConfiguration.ApiKey)
                        });

                if (String.IsNullOrEmpty(publicationUrl))
                {
                    throw new InvalidOperationException(
                        $"Post learning path package failed. LearningPathId: {learningPath.Id}");
                }

                learningPath.UpdatePublicationUrl(_urlHelper.RemoveSchemeFromUrl(publicationUrl));
            }
            catch (Exception exception)
            {
                _logger.LogException(exception);
                learningPath.ResetPublicationUrl();
                return false;
            }

            return true;
        }

    }
}