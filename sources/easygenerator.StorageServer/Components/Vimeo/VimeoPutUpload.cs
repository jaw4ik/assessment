using System;
using System.Linq;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using easygenerator.StorageServer.Components.HttpClients;
using easygenerator.StorageServer.Models;
using Newtonsoft.Json.Linq;

namespace easygenerator.StorageServer.Components.Vimeo
{
    public class VimeoPutUpload : IVimeoPutUpload
    {
        private readonly Configuration _configuration;

        private const string ticketIdFieldName = "ticket_id";
        private const string uploadLinkSecureFieldName = "upload_link_secure";
        private const string completeUriFieldName = "complete_uri";

        public VimeoPutUpload(Configuration configuration)
        {
            _configuration = configuration;
        }

        public async Task<VimeoUploadTicketModel> GetUplodTicketAsync()
        {
            using (var client = new VimeoHttpClient(_configuration.Vimeo.Token))
            {
                var url = $"{_configuration.Vimeo.Url}{_configuration.Vimeo.TicketUrl}?fields={ticketIdFieldName},{uploadLinkSecureFieldName},{completeUriFieldName}";
                object args = new { type = "streaming" };
                var response = await client.PostAsJsonAsync(url, args);

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();

                    var json = JObject.Parse(content);
                    return new VimeoUploadTicketModel()
                    {
                        Id = json[ticketIdFieldName].Value<String>(),
                        UploadUrl = json[uploadLinkSecureFieldName].Value<String>(),
                        CompleteUrl = json[completeUriFieldName].Value<String>()
                    };
                }
                return null;
            }
        }

        public async Task<bool> VerifyAsync(string verifyUrl, long size)
        {
            using (var client = new VimeoHttpClient(_configuration.Vimeo.Token))
            {
                var verifyMessage = new HttpRequestMessage(HttpMethod.Put, verifyUrl) { };
                verifyMessage.Content = new StringContent("");

                verifyMessage.Content.Headers.Add("Content-Range", "bytes */*");
                verifyMessage.Content.Headers.Add("Content-Length", "0");

                var response = await client.SendAsync(verifyMessage);

                if (response.StatusCode.ToString() == "308")
                {
                    long responseVideoSize;
                    string pattern = @"0-(?<size>[\d]+)";
                    string responseSize = Regex.Match(response.Headers.GetValues("Range").SingleOrDefault(), pattern).Groups["size"].Value;
                    if (long.TryParse(responseSize, out responseVideoSize))
                    {
                        return responseVideoSize == size;
                    }
                }

                return false;
            }
        }

        public async Task<string> CompleteAsync(string completeUrl)
        {
            using (var client = new VimeoHttpClient(_configuration.Vimeo.Token))
            {
                var url = _configuration.Vimeo.Url + completeUrl;
                var response = await client.DeleteAsync(url);
                if (response.IsSuccessStatusCode)
                {
                    return response.Headers.Location.OriginalString.Substring(8); // vimeo id
                }
                return null;
            }
        }
    }

    public interface IVimeoPutUpload
    {
        // https://developer.vimeo.com/api/upload/videos#generate-an-upload-ticket
        Task<VimeoUploadTicketModel> GetUplodTicketAsync();

        // https://developer.vimeo.com/api/upload/videos#verify-the-upload
        Task<bool> VerifyAsync(string verifyUrl, long size);

        // https://developer.vimeo.com/api/upload/videos#complete-the-upload
        Task<string> CompleteAsync(string completeUrl);
    }
}