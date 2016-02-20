using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Mvc;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using System.Net.Http;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.Controllers
{
    [NoCache]
    public class WinToWebController : DefaultApiController
    {
        private readonly ConfigurationReader _configurationReader;

        public WinToWebController(ConfigurationReader configurationReader)
        {
            _configurationReader = configurationReader;
        }

        [HttpPost]
        [Route("api/wintoweb/ticket")]
        public async Task<ActionResult> GetTicket()
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", _configurationReader.WinToWebConfiguration.ApiKey);
                try
                {
                    var response = await httpClient.PostAsJsonAsync(_configurationReader.WinToWebConfiguration.ServiceUrl, string.Empty);
                    if (response.IsSuccessStatusCode)
                    {
                        var token = await response.Content.ReadAsStringAsync();
                        return JsonSuccess(new
                        {
                            Token = token
                        });
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
}