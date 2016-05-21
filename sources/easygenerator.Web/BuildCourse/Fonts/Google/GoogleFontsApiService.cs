using System;
using System.Collections.Generic;
using System.Linq;
using easygenerator.Infrastructure.Http;
using easygenerator.Infrastructure.Net;
using easygenerator.Web.Components.Configuration;
using Newtonsoft.Json.Linq;
using easygenerator.Web.BuildCourse.Fonts.Entities;

namespace easygenerator.Web.BuildCourse.Fonts.Google
{
    public class GoogleFontsApiService : IFontsApiService
    {
        private readonly ConfigurationReader _configurationReader;
        private readonly HttpClient _httpClient;
        private readonly FileDownloader _fileDownloader;

        public GoogleFontsApiService(ConfigurationReader configurationReader, HttpClient httpClient, FileDownloader fileDownloader)
        {
            _configurationReader = configurationReader;
            _httpClient = httpClient;
            _fileDownloader = fileDownloader;
        }

        public void DownloadFont(Font font, string destinationPath)
        {
            var googleFontsResponse = _httpClient.Get(_configurationReader.GoogleFontsApiConfiguration.ServiceUrl,
                new Dictionary<string, string> { { "key", _configurationReader.GoogleFontsApiConfiguration.ApiKey } });

            var googleFonts = JObject.Parse(googleFontsResponse);
            var googleFontsItems = googleFonts["items"].ToArray();

            if (googleFontsItems.Length > 0)
            {
                var fontToDownload = googleFontsItems.FirstOrDefault(_ => string.Equals(_["family"].Value<string>(), font.FontFamily, StringComparison.CurrentCultureIgnoreCase));
                var fontFiles = fontToDownload?["files"];

                if (fontFiles != null)
                {
                    // Google uses regular instead of 400 in their responses.
                    var fontWeight = font.Weight == "400" ? "regular" : font.Weight;
                    var fontFileUrl = fontFiles[fontWeight].Value<string>();

                    if (fontFileUrl != null)
                    {
                        _fileDownloader.DownloadFile(fontFileUrl, destinationPath);
                    }
                    else
                    {
                        throw new ArgumentException($"Google doesn't have requested font (or its weight). Requested font family: {font.FontFamily}, weight: {font.Weight}.");
                    }
                }
            }
        }
    }
}