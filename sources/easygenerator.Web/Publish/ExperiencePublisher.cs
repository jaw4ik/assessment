using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Web;
using easygenerator.DomainModel.Entities;
using easygenerator.Web.BuildExperience;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;

namespace easygenerator.Web.Publish
{
    public class ExperiencePublisher : IExperiencePublisher
    {
        private readonly BuildPathProvider _pathProvider;
        private readonly PhysicalFileManager _fileManager;
        private readonly IPublishDispatcher _publishDispatcher;
        private readonly IUrlHelperWrapper _urlHelper;
        private const string PublishedPackageUrlPattern = "~/storage/{0}/";

        public ExperiencePublisher(PhysicalFileManager fileManager, BuildPathProvider pathProvider, IPublishDispatcher publishDispatcher, IUrlHelperWrapper urlHelper)
        {
            _pathProvider = pathProvider;
            _fileManager = fileManager;
            _publishDispatcher = publishDispatcher;
            _urlHelper = urlHelper;
        }

        public string GetPublishedResourcePhysicalPath(string resourceUrl)
        {
            return _pathProvider.GetPublishedResourcePath(resourceUrl.Replace("/", "\\"));
        }

        public string GetPublishedPackageUrl(string experienceId)
        {
            return _urlHelper.ToAbsoluteUrl(string.Format(PublishedPackageUrlPattern, experienceId));
        }

        public bool Publish(Experience experience)
        {
            if (!experience.BuildOn.HasValue || string.IsNullOrWhiteSpace(experience.PackageUrl))
                throw new NotSupportedException("Publishing of non builded experience is not supported.");

            string experienceId = experience.Id.ToString();

            try
            {
                // start publish, now maintenance page will be shown instead of published content
                _publishDispatcher.StartPublish(experienceId);

                PublishPackage(experienceId, experience);

                // end publish, now published content will be shown
                _publishDispatcher.EndPublish(experienceId);

                experience.UpdatePublishedOnDate();

                return true;
            }
            catch (Exception exception)
            {
                ElmahLog.LogException(exception);
                return false;
            }
        }

        protected virtual void PublishPackage(string experienceId, Experience experience)
        {
            string buildPackagePath = _pathProvider.GetBuildedPackagePath(experience.PackageUrl);
            string publishFolderPath = _pathProvider.GetPublishFolderPath(experienceId);
            CopyPublishedPackage(buildPackagePath, publishFolderPath);
        }

        private void CopyPublishedPackage(string packagePath, string destinationFolderPath)
        {
            _fileManager.DeleteDirectory(destinationFolderPath);
            _fileManager.ExtractArchiveToDirectory(packagePath, destinationFolderPath);
        }
    }
}