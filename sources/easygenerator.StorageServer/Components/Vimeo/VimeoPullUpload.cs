using System;
using System.Net.Http;
using System.Threading.Tasks;
using easygenerator.StorageServer.Components.HttpClients;
using Newtonsoft.Json.Linq;

namespace easygenerator.StorageServer.Components.Vimeo
{
    public class VimeoPullUpload : IVimeoPullUpload
    {
        private readonly Configuration _configuration;

        private const string uriFieldName = "uri";

        public VimeoPullUpload(Configuration configuration)
        {
            _configuration = configuration;
        }

        public async Task<string> PullAsync(string link)
        {
            using (var client = new VimeoHttpClient(_configuration.Vimeo.Token))
            {
                var url = $"{_configuration.Vimeo.Url}{_configuration.Vimeo.TicketUrl}?fields={uriFieldName}";
                var response = await client.PostAsJsonAsync(url, new { type = "pull", link = link });

                if (response.IsSuccessStatusCode)
                {

                    var content = await response.Content.ReadAsStringAsync();
                    var json = JObject.Parse(content);

                    var uri = json[uriFieldName].Value<String>();

                    return uri.Substring(8);
                }

                return null;
            }
        }

    }

    public interface IVimeoPullUpload
    {
        Task<string> PullAsync(string link);
    }
}