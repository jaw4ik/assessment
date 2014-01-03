﻿using System;
using System.IO;
using System.Web.Hosting;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse.Scorm.Models;
using easygenerator.Web.Components;

namespace easygenerator.Web.BuildCourse.Scorm
{
    public class ScormCourseBuilder : CourseBuilderBase, IScormCourseBuilder
    {
        private readonly RazorTemplateProvider _razorTemplateProvider;
        private const string XsdSchemasPath = "~/BuildCourse/Scorm/Schemas";
        private const string ImsManifestRazorTemplatePath = "~/BuildCourse/Scorm/Templates/imsmanifest.cshtml";
        private const string MetadataRazorTemplatePath = "~/BuildCourse/Scorm/Templates/metadata.cshtml";

        public ScormCourseBuilder(PhysicalFileManager fileManager, BuildPathProvider buildPathProvider, BuildPackageCreator buildPackageCreator, BuildContentProvider buildContentProvider, RazorTemplateProvider razorTemplateProvider)
            : base(fileManager, buildPathProvider, buildPackageCreator, buildContentProvider)
        {
            _razorTemplateProvider = razorTemplateProvider;
        }

        protected override void OnAfterBuildContentAdded(Course course, string buildId)
        {
            var buildDirectoryPath = BuildPathProvider.GetBuildDirectoryName(buildId);

            AddXsdSchemas(buildDirectoryPath);
            AddManifestFile(course, buildDirectoryPath);
            AddMetadataFile(course, buildDirectoryPath);
        }

        private void AddMetadataFile(Course course, string buildDirectoryPath)
        {
            var model = new MetadataModel
            {
                CourseTitle = course.Title,
                CourseLanguage = "en-US",
                MetadataLanguage = "en"
            };

            WriteRazorTemplateToFile(MetadataRazorTemplatePath, model, Path.Combine(buildDirectoryPath, "metadata.xml"));
        }

        private void AddManifestFile(Course course, string buildDirectoryPath)
        {
            var model = new ManifestModel
                {
                    CourseTitle = course.Title,
                    MasteryScore = 100,
                    Id = "EG" + Guid.NewGuid(),
                    StartPage = "index.html"
                };

            foreach (var resourcePath in FileManager.GetAllFilesInDirectory(buildDirectoryPath))
            {
                var resourceRelativePath = FileManager.GetRelativePath(resourcePath, buildDirectoryPath).Replace(@"\", "/");
                model.Resources.Add(resourceRelativePath);
            }

            WriteRazorTemplateToFile(ImsManifestRazorTemplatePath, model, Path.Combine(buildDirectoryPath, "imsmanifest.xml"));
        }

        private void AddXsdSchemas(string buildDirectoryPath)
        {
            foreach (var schemaFilePath in FileManager.GetAllFilesInDirectory(HostingEnvironment.MapPath(XsdSchemasPath)))
            {
                FileManager.CopyFileToDirectory(schemaFilePath, buildDirectoryPath);
            }
        }

        private void WriteRazorTemplateToFile(string templatePath, dynamic model, string filePath)
        {
            var content = _razorTemplateProvider.Get(templatePath, model);
            FileManager.WriteToFile(filePath, content);
        }
    }
}