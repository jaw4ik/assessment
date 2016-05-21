using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using Newtonsoft.Json.Linq;
using easygenerator.Web.BuildCourse.Fonts.Entities;

namespace easygenerator.Web.BuildCourse.Fonts
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
            var manifest = JObject.Parse(_manifestFileManager.ReadManifest(course.Template));
            if (manifest["supports"].ToArray().Any(_ => _.Value<string>().Equals("fonts", StringComparison.CurrentCultureIgnoreCase)))
            {
                AddCustomFontsToPackage(buildDirectory, course);
            }

            var fontsToLoad = new List<Font>();

            var manifestFonts = manifest["fonts"]?.ToArray();
            if (manifestFonts != null)
            {
                var manifestWasModified = false;
                foreach (var font in manifestFonts)
                {
                    if (!font["local"].Value<bool>())
                    {
                        var fontFamilyName = font["fontFamily"].Value<string>();
                        var fontVariantsToLoad =
                            font["variants"].ToArray().Select(_ => new Font(fontFamilyName, _.Value<string>())).ToList();
                        fontsToLoad.AddRange(fontVariantsToLoad);
                        font["local"] = "true";
                        manifestWasModified = true;
                    }
                }
                if (manifestWasModified)
                {
                    _fileManager.WriteToFile(_buildPathProvider.GetManifestFilePath(buildDirectory), manifest.ToString());
                }
            }

            AddFontsToThePackageAndToCss(buildDirectory, fontsToLoad);
        }

        private void AddCustomFontsToPackage(string buildDirectory, Course course)
        {
            var courseSettings = course.GetTemplateSettings(course.Template);
            var fontsToAdd = new List<Font>();

            if (courseSettings != null)
            {
                var settings = JObject.Parse(courseSettings);
                var fonts = settings["fonts"].ToArray();
                fontsToAdd.AddRange(fonts.Select(font => new Font(font["fontFamily"].Value<string>())).Distinct());
            }

            // as default we have to load Roboto Slab
            if (fontsToAdd.Count == 0)
            {
                fontsToAdd.Add(new Font("Roboto Slab"));
            }

            AddFontsToThePackageAndToCss(buildDirectory, fontsToAdd);
        }

        private void AddFontsToThePackageAndToCss(string buildDirectory, IEnumerable<Font> fontsToAdd)
        {
            if (!fontsToAdd.Any())
            {
                return;
            }

            var fontsFolder = GetFolderForFonts(buildDirectory);

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