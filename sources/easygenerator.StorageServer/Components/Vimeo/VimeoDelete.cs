using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using easygenerator.StorageServer.Components.Elmah;
using easygenerator.StorageServer.Components.HttpClients;
using Newtonsoft.Json.Linq;

namespace easygenerator.StorageServer.Components.Vimeo
{
    public class VimeoDelete : IVimeoDelete
    {
        private readonly Configuration _configuration;
        private readonly ILog _log;

        public VimeoDelete(Configuration configuration, ILog log)
        {
            _configuration = configuration;
            _log = log;
        }
        public async Task<bool> DeleteAsync(string id)
        {
            using (var client = new VimeoHttpClient(_configuration.Vimeo.Token))
            {
                var url = $"{_configuration.Vimeo.Url}{_configuration.Vimeo.VideosEndpoint}/{id}";
                var response = await client.DeleteAsync(url);

                if (response.IsSuccessStatusCode && response.StatusCode == HttpStatusCode.NoContent)
                    return true;

                _log.LogException(new ApplicationException($"Failed to delete video from Vimeo. Detaild: video vimeoId:'{id}'; response status code: {response.StatusCode}"));
                return false;
            }
        }
    }

    public interface IVimeoDelete
    {
        Task<bool> DeleteAsync(string id);
    }
}