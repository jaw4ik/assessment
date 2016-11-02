using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using easygenerator.Infrastructure.Http;
using easygenerator.Infrastructure.Net;
using easygenerator.Web.Components.Configuration;
using Newtonsoft.Json.Linq;
using easygenerator.Web.BuildCourse.Fonts.Entities;
using System.Net;

namespace easygenerator.Web.BuildCourse.Fonts.Custom
{
    public class CustomFontsApiService : IFontsApiService
    {
        private readonly ConfigurationReader _configurationReader;
        private readonly HttpClient _httpClient;
        private readonly FileDownloader _fileDownloader;

        public CustomFontsApiService(ConfigurationReader configurationReader, HttpClient httpClient, FileDownloader fileDownloader)
        {
            _configurationReader = configurationReader;
            _httpClient = httpClient;
            _fileDownloader = fileDownloader;
        }

        public void DownloadFont(Font font, string destinationPath)
        {
            try
            {
                _fileDownloader.DownloadFile(GetFontUrl(font), destinationPath);
            }
            catch
            {
                ThrowFontNotFoundException(font);
            }
        }

        private string GetFontUrl(Font font)
        {
            var fontWeight = int.Parse(font.Weight) <= 400 ? "regular" : "bold";
            return $"{_configurationReader.CustomFontPath}{font.FontFamily.ToLower()}-{fontWeight}.woff";
        }

        private void ThrowFontNotFoundException(Font font)
        {
            throw new ArgumentException($"Custom fonts (or its weight) have not requested. Requested font family: {font.FontFamily}, weight: {font.Weight}.");
        }
    }
}