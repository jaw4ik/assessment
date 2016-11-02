using System.IO;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.BuildCourse.Fonts.Entities;
using easygenerator.Web.BuildCourse.Fonts.Custom;
using easygenerator.Web.BuildCourse.Fonts.Google;
using System;

namespace easygenerator.Web.BuildCourse.Fonts
{
    public class FontsProvider
    {
        private readonly HttpRuntimeWrapper _httpRuntimeWrapper;
        private readonly PhysicalFileManager _physicalFileManager;
        private readonly CourseContentPathProvider _contentPathProvider;
        private readonly IDependencyResolverWrapper _dependencyResolver;

        public FontsProvider(HttpRuntimeWrapper httpRuntimeWrapper, PhysicalFileManager physicalFileManager, CourseContentPathProvider contentPathProvider, IDependencyResolverWrapper dependencyResolver)
        {
            _httpRuntimeWrapper = httpRuntimeWrapper;
            _physicalFileManager = physicalFileManager;
            _contentPathProvider = contentPathProvider;
            _dependencyResolver = dependencyResolver;
        }

        public string GetFontPath(Font font)
        {
            var fontFilePath = GetFontFilePath(font);
            if (!_physicalFileManager.FileExists(fontFilePath))
            {
                IFontsApiService fontApiService = GetFontService(font.Place);
                fontApiService.DownloadFont(font, fontFilePath);
            }
            return fontFilePath;
        }

        private IFontsApiService GetFontService(string fontPlace)
        {

            IFontsApiService fontApiService;
            switch (fontPlace)
            {
                case "google":
                    fontApiService = _dependencyResolver.GetService<GoogleFontsApiService>();
                    break;
                case "custom":
                    fontApiService = _dependencyResolver.GetService<CustomFontsApiService>();
                    break;
                default:
                    throw new NotImplementedException($"Font api service for \"{fontPlace}\" has not implemented yet.");
            }
            return fontApiService;
        }

        public string GetIncludeFontCss(Font font, string fontFilePath)
        {
            var fontWebPath = _contentPathProvider.GetFontWebPath(fontFilePath);

            return @"@font-face {
                      font-family: '" + font.FontFamily + @"';
                      font-weight: " + font.Weight + @";
                      font-style: normal;                      
                      src: local('" + font.FontFamily + @" Regular'),                           
                           url('" + fontWebPath + @"') format('truetype');
                    }";
        }

        private string GetFontFilePath(Font font)
        {
            var fontFileName = $"{font.FontFamily.ToLower().Replace(" ", "")}-{font.Weight}.ttf";
            return Path.Combine(_httpRuntimeWrapper.GetDomainAppPath(), "Content", "google-fonts", fontFileName);
        }
    }
}