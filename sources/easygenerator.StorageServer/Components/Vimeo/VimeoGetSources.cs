using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http.Results;
using easygenerator.StorageServer.Components.HttpClients;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace easygenerator.StorageServer.Components.Vimeo
{
    public class VimeoGetSources : IVimeoGetSources
    {
        private readonly Configuration _configuration;

        public VimeoGetSources(Configuration configuration)
        {
            _configuration = configuration;
        }

        public async Task<object> GetSourcesAsync(string id)
        {
            using (var client = new VimeoHttpClient(_configuration.Vimeo.Token))
            {
                var url = _configuration.Vimeo.Url + _configuration.Vimeo.TicketUrl + "/" + id;
                var response = await client.GetAsync(url);

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var json = JObject.Parse(content);

                    var files = json["files"];
                    var status = json["status"];
                    
                    if (files != null && status != null)
                    {
                        return new
                        {
                            files = files.Value<object>(),
                            status = status.Value<string>()
                        };
                    }
                }

                return response;
            }
        }

    }

    public interface IVimeoGetSources
    {
        Task<object> GetSourcesAsync(string id);
    }
}