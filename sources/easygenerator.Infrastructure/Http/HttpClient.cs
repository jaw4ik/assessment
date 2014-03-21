using Newtonsoft.Json;
using System.Net.Http;
using System.Text;

namespace easygenerator.Infrastructure.Http
{
    public class HttpClient
    {
        public virtual TResponse Post<TResponse>(string url, object postData)
        {
            return Post<TResponse>(url, JsonConvert.SerializeObject(postData));
        }

        public virtual TResponse Post<TResponse>(string url, string postJsonData)
        {
            using (var client = new System.Net.Http.HttpClient(new HttpClientHandler() { UseProxy = false }))
            {
                HttpResponseMessage response = client.PostAsync(url, new StringContent(postJsonData, Encoding.UTF8, "application/json")).Result;
                string responseBody = response.Content.ReadAsStringAsync().Result;

                if (!response.IsSuccessStatusCode)
                {
                    throw new HttpRequestExceptionExtended(url, postJsonData, response.RequestMessage.ToString(), response.StatusCode,
                        response.ReasonPhrase, responseBody);
                }

                return JsonConvert.DeserializeObject<TResponse>(responseBody);
            }
        }
    }
}
