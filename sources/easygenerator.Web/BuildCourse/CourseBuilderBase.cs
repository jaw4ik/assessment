﻿using System;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.BuildCourse
{
    public abstract class CourseBuilderBase : ICourseBuilder
    {
        protected readonly PhysicalFileManager FileManager;
        protected readonly BuildPathProvider BuildPathProvider;
        protected readonly BuildPackageCreator BuildPackageCreator;
        protected readonly BuildContentProvider BuildContentProvider;
        protected readonly ILog Logger;

        protected CourseBuilderBase(PhysicalFileManager fileManager, BuildPathProvider buildPathProvider, BuildPackageCreator buildPackageCreator, BuildContentProvider buildContentProvider, ILog logger)
        {
            FileManager = fileManager;
            BuildPathProvider = buildPathProvider;
            BuildPackageCreator = buildPackageCreator;
            BuildContentProvider = buildContentProvider;
            Logger = logger;
        }

        public virtual bool Build(Course course)
        {
            var courseId = course.Id.ToNString();
            var buildId = GenerateBuildId(courseId);
            var isBuildSuccessful = true;

            try
            {
                CreatePackageDirectory(buildId);

                BuildContentProvider.AddBuildContentToPackageDirectory(BuildPathProvider.GetBuildDirectoryName(buildId), course, GetPublishSettings());
                OnAfterBuildContentAdded(course, buildId);

                CreatePackageFromDirectory(buildId);
                OnAfterBuildPackageCreated(course, buildId);
            }
            catch (Exception exception)
            {
                Logger.LogException(exception);
                isBuildSuccessful = false;
            }

            try
            {
                DeleteOutdatedPackages(buildId, courseId);
                DeleteTempPackageDirectory(buildId);
            }
            catch (Exception exception)
            {
                Logger.LogException(exception);
            }

            return isBuildSuccessful;
        }

        protected virtual void OnAfterBuildPackageCreated(Course course, string buildId)
        {
        }

        protected virtual void OnAfterBuildContentAdded(Course course, string buildId)
        {
        }

        protected virtual string GetPublishSettings()
        {
            return string.Empty;
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