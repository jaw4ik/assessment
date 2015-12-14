using System;
using System.Net.Http;
using System.Net.Http.Headers;

namespace easygenerator.StorageServer.Components.HttpClients
{
    public class AuthHttpClient : HttpClient
    {
        public AuthHttpClient(string token = null)
        {
            if (!String.IsNullOrEmpty(token))
            {
                DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", token);
            }

            DefaultRequestHeaders.Accept.Clear();
            DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }
    }
}