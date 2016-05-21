using System.IO;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.BuildCourse.Fonts.Entities;

namespace easygenerator.Web.BuildCourse.Fonts
{
    public class FontsProvider
    {
        private readonly HttpRuntimeWrapper _httpRuntimeWrapper;
        private readonly PhysicalFileManager _physicalFileManager;
        private readonly IFontsApiService _fontsApiService;
        private readonly CourseContentPathProvider _contentPathProvider;

        public FontsProvider(HttpRuntimeWrapper httpRuntimeWrapper, PhysicalFileManager physicalFileManager, IFontsApiService fontsApiService, CourseContentPathProvider contentPathProvider)
        {
            _httpRuntimeWrapper = httpRuntimeWrapper;
            _physicalFileManager = physicalFileManager;
            _fontsApiService = fontsApiService;
            _contentPathProvider = contentPathProvider;
        }

        public string GetFontPath(Font font)
        {
            var fontFilePath = GetFontFilePath(font);
            if (!_physicalFileManager.FileExists(fontFilePath))
            {
                _fontsApiService.DownloadFont(font, fontFilePath);
            }
            return fontFilePath;
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