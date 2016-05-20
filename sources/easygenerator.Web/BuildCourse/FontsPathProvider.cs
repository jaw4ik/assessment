using System.IO;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse.GoogleFonts;
using easygenerator.Web.Components;

namespace easygenerator.Web.BuildCourse
{
    public class FontsProvider
    {
        private readonly HttpRuntimeWrapper _httpRuntimeWrapper;
        private readonly PhysicalFileManager _physicalFileManager;
        private readonly GoogleFontsApiService _fontsApiService;
        private readonly CourseContentPathProvider _contentPathProvider;

        public FontsProvider(HttpRuntimeWrapper httpRuntimeWrapper, PhysicalFileManager physicalFileManager, GoogleFontsApiService fontsApiService, CourseContentPathProvider contentPathProvider)
        {
            _httpRuntimeWrapper = httpRuntimeWrapper;
            _physicalFileManager = physicalFileManager;
            _fontsApiService = fontsApiService;
            _contentPathProvider = contentPathProvider;
        }

        public string GetFontPath(string fontName)
        {
            var fontFilePath = GetFontFilePath(fontName);
            if (!_physicalFileManager.FileExists(fontFilePath))
            {
                _fontsApiService.DownloadFont(fontName, fontFilePath);
            }
            return fontFilePath;
        }

        public string GetIncludeFontCss(string fontName, string fontFilePath)
        {
            var fontWebPath = _contentPathProvider.GetFontWebPath(fontFilePath);

            return @"@font-face {
                      font-family: '" + fontName + @"';
                      font-weight: 400;
                      font-style: normal;                      
                      src: local('" + fontName + @" Regular'),                           
                           url('" + fontWebPath + @"') format('truetype');
                    }";
        }

        private string GetFontFilePath(string fontName)
        {
            var fontFileName = $"{fontName.ToLower().Replace(" ", "")}-regular.ttf";
            return Path.Combine(_httpRuntimeWrapper.GetDomainAppPath(), "Content", "google-fonts", fontFileName);
        }
    }
}