using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace easygenerator.StorageServer.Components.Convertion
{
    public class ConvertionService : IConvertionService
    {
        private readonly Configuration _configuration;

        public ConvertionService(Configuration configuration)
        {
            _configuration = configuration;
        }

        public async Task<string> GetTicketAsync()
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", _configuration.ConvertionService.Token);
                try
                {
                    var response = await httpClient.PostAsJsonAsync(UrlResolver.AddCurrentScheme(_configuration.ConvertionService.Url), String.Empty);
                    if (response.IsSuccessStatusCode)
                    {
                        return await response.Content.ReadAsStringAsync();
                    }
                    return null;
                }
                catch
                {
                    return null;
                }
            }
        }
    }

    public interface IConvertionService
    {
        Task<string> GetTicketAsync();
    }
}