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
        private static readonly IEnumerable<string> StandardFonts = new[] { "Arial", "Times new roman", "Verdana" };

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
            var fontsToAdd = GetDesignTabFonts(manifest, course);
            var templateFonts = GetTemplateFonts(manifest);

            if (templateFonts.Any())
            {
                fontsToAdd.AddRange(templateFonts);
                ChangeManifestToUseLocalFonts(manifest);
                _fileManager.WriteToFile(_buildPathProvider.GetManifestFilePath(buildDirectory), manifest.ToString());
            }

            AddFontsToPackage(buildDirectory, fontsToAdd);
        }

        private List<Font> GetDesignTabFonts(JObject manifest, Course course)
        {
            var designTabFonts = new List<Font>();
            var supportFeatures = manifest["supports"];
            if (supportFeatures != null && supportFeatures.ToArray().Any(_ => _.Value<string>().Equals("fonts", StringComparison.CurrentCultureIgnoreCase)))
            {
                var courseSettings = course.GetTemplateSettings(course.Template);
                if (courseSettings != null)
                {
                    var settings = JObject.Parse(courseSettings);
                    var fonts = settings["fonts"].ToArray();
                    designTabFonts.AddRange(fonts.Select(font => new Font(font["fontFamily"].Value<string>())));
                }

                // as default we have to load Roboto Slab
                if (designTabFonts.Count == 0)
                {
                    designTabFonts.Add(new Font("Roboto Slab"));
                }
            }
            return designTabFonts;
        }

        private List<Font> GetTemplateFonts(JObject manifest)
        {
            var templateFonts = new List<Font>();
            var manifestFonts = manifest["fonts"]?.ToArray();

            if (manifestFonts != null)
            {
                foreach (var font in manifestFonts)
                {
                    if (!font["local"].Value<bool>())
                    {
                        var fontFamilyName = font["fontFamily"].Value<string>();
                        var fontVariants = font["variants"].ToArray().Select(_ => new Font(fontFamilyName, _.Value<string>())).ToList();
                        templateFonts.AddRange(fontVariants);
                    }
                }
            }
            return templateFonts;
        }

        private void ChangeManifestToUseLocalFonts(JObject manifest)
        {
            var manifestFonts = manifest["fonts"]?.ToArray();

            if (manifestFonts != null)
            {
                foreach (var font in manifestFonts.Where(font => !font["local"].Value<bool>()))
                {
                    font["local"] = "true";
                }
            }
        }

        private void AddFontsToPackage(string buildDirectory, IEnumerable<Font> fontsToAdd)
        {
            //remove standard fonts
            fontsToAdd = fontsToAdd.Where(_ => !StandardFonts.Any(fontName => _.FontFamily.Equals(fontName, StringComparison.CurrentCultureIgnoreCase)));

            if (!fontsToAdd.Any())
            {
                return;
            }

            fontsToAdd = fontsToAdd.Distinct();
            var fontsFolder = GetFolderForFonts(buildDirectory);

            var includeFontsCssStringBuilder = new StringBuilder();

            foreach (var fontToAdd in fontsToAdd)
            {
                var fontPath = _fontsProvider.GetFontPath(fontToAdd);
                _fileManager.CopyFileToDirectory(fontPath, fontsFolder);

                var includeFontCss = _fontsProvider.GetIncludeFontCss(fontToAdd, fontPath);
                includeFontsCssStringBuilder.AppendLine(includeFontCss);
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