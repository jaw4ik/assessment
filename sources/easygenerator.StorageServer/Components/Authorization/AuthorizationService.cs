using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using easygenerator.StorageServer.Components.HttpClients;
using easygenerator.StorageServer.Models;
using easygenerator.StorageServer.Models.AuthIdentify;
using Newtonsoft.Json;

namespace easygenerator.StorageServer.Components.Authorization
{
    public class AuthorizationService : IAuthorizationService
    {
        public async Task<AccessType> GetUserAccessTypeAsync(string token, string identityUrl)
        {
            using (var client = new AuthHttpClient(token))
            {
                object args = new { };
                var response = await client.PostAsJsonAsync(UrlResolver.AddCurrentScheme(identityUrl), args);
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();

                    var responseModel = JsonConvert.DeserializeObject<TaskModel>(content);

                    if (responseModel.Success &&
                        responseModel.Data.Subscription.AccessType > AccessType.Free &&
                        responseModel.Data.Subscription.ExpirationDate.HasValue &&
                        responseModel.Data.Subscription.ExpirationDate > DateTime.UtcNow)
                    {
                        return responseModel.Data.Subscription.AccessType;

                    }
                }
            }
            return AccessType.Free;
        }
    }

    public interface IAuthorizationService
    {
        Task<AccessType> GetUserAccessTypeAsync(string token, string identityUrl);
    }
}