using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using Newtonsoft.Json.Linq;

namespace easygenerator.Web.BuildCourse
{
    public interface IPackageFontsFetcher
    {
        void AddFontsToPackage(string buildDirectory, Course course);
    }

    public class PackageFontsFetcher : IPackageFontsFetcher
    {
        private readonly CourseContentPathProvider _buildPathProvider;
        private readonly PhysicalFileManager _fileManager;
        private readonly FontsProvider _fontsProvider;
        private readonly ManifestFileManager _manifestFileManager;

        public PackageFontsFetcher(CourseContentPathProvider buildPathProvider, PhysicalFileManager fileManager, FontsProvider fontsProvider, ManifestFileManager manifestFileManager)
        {
            _buildPathProvider = buildPathProvider;
            _fileManager = fileManager;
            _fontsProvider = fontsProvider;
            _manifestFileManager = manifestFileManager;
        }

        public void AddFontsToPackage(string buildDirectory, Course course)
        {
            if (!TemplateSupportsCustomFonts(course.Template))
            {
                return;
            }

            var fontsFolder = GetFolderForFonts(buildDirectory);

            var courseSettings = course.GetTemplateSettings(course.Template);
            List<string> fontsToAdd = new List<string>();

            if (courseSettings != null)
            {
                var settings = JObject.Parse(courseSettings);
                var fonts = settings["fonts"].ToArray();
                fontsToAdd.AddRange(fonts.Select(font => font["fontFamily"].Value<string>()).Distinct());
            }

            // as default we have to load Roboto Slab
            if (fontsToAdd.Count == 0)
            {
                fontsToAdd.Add("Roboto Slab");
            }

            var includeFontsCssStringBuilder = new StringBuilder();

            foreach (var fontToAdd in fontsToAdd)
            {
                var fontPath = _fontsProvider.GetFontPath(fontToAdd);
                _fileManager.CopyFileToDirectory(fontPath, fontsFolder);

                var includeFontCss = _fontsProvider.GetIncludeFontCss(fontToAdd, fontPath);
                includeFontsCssStringBuilder.Append(includeFontCss);
            }

            _fileManager.AppendToFile(_buildPathProvider.GetFontsStylesheetFilePath(buildDirectory), includeFontsCssStringBuilder.ToString());
        }

        private bool TemplateSupportsCustomFonts(Template template)
        {
            var manifest = JObject.Parse(_manifestFileManager.ReadManifest(template));
            var supportsFeatures = manifest["supports"].ToArray();
            return supportsFeatures.Any(_ => _.Value<string>().Equals("fonts", StringComparison.CurrentCultureIgnoreCase));
        }

        private string GetFolderForFonts(string buildDirectory)
        {
            var folderForMedia = _buildPathProvider.GetIncludedFontsDirectoryPath(buildDirectory);

            if (!_fileManager.DirectoryExists(folderForMedia))
            {
                _fileManager.CreateDirectory(folderForMedia);
            }

            return folderForMedia;
        }
    }
}