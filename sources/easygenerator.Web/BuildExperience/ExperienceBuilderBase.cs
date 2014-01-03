using System;
using System.IO;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience.PackageModel;
using easygenerator.Web.Components;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.BuildExperience
{
    public abstract class ExperienceBuilderBase : IExperienceBuilder
    {
        protected readonly PhysicalFileManager FileManager;
        protected readonly BuildPathProvider BuildPathProvider;
        protected readonly BuildPackageCreator BuildPackageCreator;
        protected readonly BuildContentProvider BuildContentProvider;

        protected ExperienceBuilderBase(PhysicalFileManager fileManager, BuildPathProvider buildPathProvider, BuildPackageCreator buildPackageCreator, BuildContentProvider buildContentProvider)
        {
            FileManager = fileManager;
            BuildPathProvider = buildPathProvider;
            BuildPackageCreator = buildPackageCreator;
            BuildContentProvider = buildContentProvider;
        }

        public virtual bool Build(Experience experience)
        {
            var experienceId = experience.Id.ToNString();
            var buildId = GenerateBuildId(experienceId);
            var isBuildSuccessful = true;

            try
            {
                CreatePackageDirectory(buildId);

                BuildContentProvider.AddBuildContentToPackageDirectory(buildId, experience);
                OnAfterBuildContentAdded(experience, buildId);

                CreatePackageFromDirectory(buildId);
                OnAfterBuildPackageCreated(experience, buildId);
            }
            catch (Exception exception)
            {
                ElmahLog.LogException(exception);
                isBuildSuccessful = false;
            }

            try
            {
                DeleteOutdatedPackages(buildId, experienceId);
                DeleteTempPackageDirectory(buildId);
            }
            catch (Exception exception)
            {
                ElmahLog.LogException(exception);
            }

            return isBuildSuccessful;
        }

        protected virtual void OnAfterBuildPackageCreated(Experience experience, string buildId)
        {
        }

        protected virtual void OnAfterBuildContentAdded(Experience experience, string buildId)
        {
        }

        private void CreatePackageDirectory(string buildId)
        {
            FileManager.CreateDirectory(BuildPathProvider.GetBuildDirectoryName(buildId));
        }

        private void CreatePackageFromDirectory(string buildId)
        {
            BuildPackageCreator.CreatePackageFromFolder(BuildPathProvider.GetBuildDirectoryName(buildId),
                                                         BuildPathProvider.GetBuildPackageFileName(buildId));
        }

        private void DeleteOutdatedPackages(string buildId, string packageId)
        {
            var packagePath = BuildPathProvider.GetDownloadPath();
            FileManager.DeleteFilesInDirectory(packagePath, packageId + "*.zip", buildId + ".zip");
        }

        private void DeleteTempPackageDirectory(string buildId)
        {
            FileManager.DeleteDirectory(BuildPathProvider.GetBuildDirectoryName(buildId));
        }

        private string GenerateBuildId(string packageId)
        {
            var buildDate = String.Format(" {0:yyyyMMdd-HH-mm-ss}-UTC", DateTimeWrapper.Now());
            return packageId + buildDate;
        }
    }
}