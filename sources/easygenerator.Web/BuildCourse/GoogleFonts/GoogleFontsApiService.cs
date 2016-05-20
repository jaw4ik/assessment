using System;
using System.Collections.Generic;
using System.Linq;
using easygenerator.Infrastructure.Http;
using easygenerator.Infrastructure.Net;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.BuildCourse.GoogleFonts
{
    public class GoogleFontsApiService
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

        public void DownloadFont(string fontName, string destinationPath)
        {
            var googleFonts = _httpClient.Get<Entities.GoogleFonts>(_configurationReader.GoogleFontsApiConfiguration.ServiceUrl,
                new Dictionary<string, string> { { "key", _configurationReader.GoogleFontsApiConfiguration.ApiKey } });

            if (googleFonts?.Items != null)
            {
                var fontToDownload = googleFonts.Items.FirstOrDefault(_ => string.Equals(_.Family, fontName, StringComparison.CurrentCultureIgnoreCase));
                var fontUrl = fontToDownload?.Files?.Regular;

                if (fontUrl != null)
                {
                    _fileDownloader.DownloadFile(fontUrl, destinationPath);
                }
            }
        }
    }
}