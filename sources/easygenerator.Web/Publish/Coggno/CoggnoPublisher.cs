using System;
using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Http;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Publish.Coggno
{
    public class CoggnoPublisher : ICoggnoPublisher
    {
        protected IUrlHelperWrapper UrlHelper { get; }
        protected BuildPathProvider PathProvider { get; }
        protected PhysicalFileManager FileManager { get; }
        protected ILog Logger { get; }
        protected HttpClient HttpClient { get; }
        protected ConfigurationReader ConfigurationReader { get; }

        public CoggnoPublisher(IUrlHelperWrapper urlHelper, PhysicalFileManager fileManager, BuildPathProvider pathProvider, ILog logger, HttpClient httpClient, ConfigurationReader configurationReader)
        {
            UrlHelper = urlHelper;
            PathProvider = pathProvider;
            Logger = logger;
            HttpClient = httpClient;
            ConfigurationReader = configurationReader;
            FileManager = fileManager;
        }

        public bool Publish<T>(T entity, string userFirstName, string userLastName) where T : ICoggnoPublishableEntity
        {
            try
            {
                var entityId = entity.Id.ToNString();
                var fileName = $"\"{entityId}.zip\"";
                if (string.IsNullOrEmpty(entity.ScormPackageUrl))
                {
                    throw new InvalidOperationException($"Entity cannot be published to coggno. Probably it was not built. EntityId: {entityId}");
                }

                var package = FileManager.GetFileBytes(PathProvider.GetBuildedPackagePath(entity.ScormPackageUrl));
                var publishMethodPath = ConfigurationReader.CoggnoConfiguration.PublicationUrl;

                HttpClient.PostFile<string>(
                    publishMethodPath,
                    fileName,
                    package,
                    new[] {
                        new KeyValuePair<string, string>("id", entityId),
                        new KeyValuePair<string, string>("title", entity.Title),
                        new KeyValuePair<string, string>("userEmail", entity.CreatedBy),
                        new KeyValuePair<string, string>("userFirstName", userFirstName),
                        new KeyValuePair<string, string>("userLastName", userLastName),
                        new KeyValuePair<string, string>("category", "Unknown")
                    },
                    new[] {
                        new KeyValuePair<string, string>("X-Api-Key", ConfigurationReader.CoggnoConfiguration.ApiKey)
                    },
                    "\"scormPackage\""
                );
                entity.MarkAsPublishedForSale();
            }
            catch (Exception exception)
            {
                Logger.LogException(exception);
                return false;
            }
            return true;
        }
    }
}