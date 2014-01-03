using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience.Scorm.Models;
using easygenerator.Web.Components;

namespace easygenerator.Web.BuildExperience.Scorm
{
    public class ScormExperienceBuilder : ExperienceBuilderBase, IScormExperienceBuilder
    {
        private readonly RazorTemplateProvider _razorTemplateProvider;
        private const string XsdSchemasPath = "~/BuildExperience/Scorm/Schemas";
        private const string ImsManifestRazorTemplatePath = "~/BuildExperience/Scorm/Templates/imsmanifest.cshtml";
        private const string MetadataRazorTemplatePath = "~/BuildExperience/Scorm/Templates/metadata.cshtml";

        public ScormExperienceBuilder(PhysicalFileManager fileManager, BuildPathProvider buildPathProvider, BuildPackageCreator buildPackageCreator, BuildContentProvider buildContentProvider, RazorTemplateProvider razorTemplateProvider)
            : base(fileManager, buildPathProvider, buildPackageCreator, buildContentProvider)
        {
            _razorTemplateProvider = razorTemplateProvider;
        }

        protected override void OnAfterBuildContentAdded(Experience experience, string buildId)
        {
            var buildDirectoryPath = BuildPathProvider.GetBuildDirectoryName(buildId);

            AddXsdSchemas(buildDirectoryPath);
            AddManifestFile(experience, buildDirectoryPath);
            AddMetadataFile(experience, buildDirectoryPath);
        }

        private void AddMetadataFile(Experience experience, string buildDirectoryPath)
        {
            var model = new MetadataModel
            {
                CourseTitle = experience.Title,
                CourseLanguage = "en-US",
                MetadataLanguage = "en"
            };

            WriteRazorTemplateToFile(MetadataRazorTemplatePath, model, Path.Combine(buildDirectoryPath, "metadata.xml"));
        }

        private void AddManifestFile(Experience experience, string buildDirectoryPath)
        {
            var model = new ManifestModel
                {
                    CourseTitle = experience.Title,
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