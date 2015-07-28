using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Http;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.Components.Configuration;
using System;

namespace easygenerator.Web.Publish
{
    public class LearningPathPublisher : ILearningPathPublisher
    {
        private ILog _logger;
        private PhysicalFileManager _fileManager;
        private BuildPathProvider _pathProvider; 
        private HttpClient _httpClient;
        private readonly ConfigurationReader _configurationReader;

        public LearningPathPublisher(ILog logger, PhysicalFileManager fileManager, BuildPathProvider pathProvider, HttpClient httpClient, ConfigurationReader configurationReader)
        {
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
                    throw new NotSupportedException(String.Format("Publishing of non builded learning path is not supported. LearningPathId: {0}", learningPath.Id));
                }

                var package = _fileManager.GetFileBytes(_pathProvider.GetBuildedPackagePath(learningPath.PackageUrl));
                var publicationUrl = _httpClient.PostFile<string>(GetPostUrl(learningPath.Id), learningPath.Id.ToString(), package);

                if (String.IsNullOrEmpty(publicationUrl))
                {
                    throw new InvalidOperationException(String.Format("Post learning path package failed. LearningPathId: {0}", learningPath.Id));
                }

                learningPath.UpdatePublicationUrl(publicationUrl);
            }
            catch (Exception exception)
            {
                _logger.LogException(exception);
                learningPath.ResetPublicationUrl();
                return false;
            }

            return true;
        }

        private string GetPostUrl(Guid learningPathId)
        {
            return string.Format("{0}/api/publish?key={1}&courseid={2}", _configurationReader.PublicationConfiguration.ServiceUrl,
                _configurationReader.PublicationConfiguration.ApiKey, learningPathId);
        }
    }
}