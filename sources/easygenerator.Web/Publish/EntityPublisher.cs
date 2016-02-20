using System;
using System.Collections.Generic;
using System.Globalization;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Http;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.Publish
{
    public class EntityPublisher : IEntityPublisher
    {
        protected IUrlHelperWrapper UrlHelper { get; }
        protected BuildPathProvider PathProvider { get; }
        protected PhysicalFileManager FileManager { get; }
        protected ILog Logger { get; }
        protected HttpClient HttpClient { get; }
        protected ConfigurationReader ConfigurationReader { get; }

        public EntityPublisher(IUrlHelperWrapper urlHelper, PhysicalFileManager fileManager, BuildPathProvider pathProvider, ILog logger, HttpClient httpClient, ConfigurationReader configurationReader)
        {
            UrlHelper = urlHelper;
            PathProvider = pathProvider;
            Logger = logger;
            HttpClient = httpClient;
            ConfigurationReader = configurationReader;
            FileManager = fileManager;
        }

        public bool Publish<T>(T entity) where T : IPublishableEntity
        {
            try
            {
                var entityId = entity.Id.ToString();
                if (string.IsNullOrEmpty(entity.PackageUrl))
                {
                    throw new InvalidOperationException($"Entity cannot be published. Probably it was not built. EntityId: {entityId}");
                }

                var package = FileManager.GetFileBytes(PathProvider.GetBuildedPackagePath(entity.PackageUrl));
                var publishMethodPath = UrlHelper.AddCurrentSchemeToUrl($"{ConfigurationReader.PublicationConfiguration.ServiceUrl}/api/publish/{entityId}");

                var publicationUrl = HttpClient.PostFile<string>(
                        publishMethodPath,
                        entityId,
                        package,
                        formValues: new[] {
                                            new KeyValuePair<string, string>("ownerEmail", entity.CreatedBy),
                                            new KeyValuePair<string, string>("title", entity.Title),
                                            new KeyValuePair<string, string>("createdDate", entity.CreatedOn.ToString(CultureInfo.InvariantCulture))
                        },
                        headerValues: new[] {
                                            new KeyValuePair<string, string>("key", ConfigurationReader.PublicationConfiguration.ApiKey)
                        });

                if (string.IsNullOrEmpty(publicationUrl))
                {
                    throw new InvalidOperationException($"Publication failed, publication url is empty. EntityId: {entityId}");
                }

                entity.UpdatePublicationUrl(UrlHelper.RemoveSchemeFromUrl(publicationUrl));
            }
            catch (Exception exception)
            {
                Logger.LogException(exception);
                entity.ResetPublicationUrl();
                return false;
            }

            return true;
        }

    }
}