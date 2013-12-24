using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;
using System.Web.Script.Serialization;

namespace easygenerator.Web.Components.Http
{
    public class HttpHelper
    {
        public virtual TResponse Post<TRequest, TResponse>(string url, TRequest postData)
        {
            using (var client = new HttpClient(new HttpClientHandler() { UseProxy = false }))
            {
                HttpResponseMessage response = client.PostAsync(url, postData, new JsonMediaTypeFormatter()).Result;
                string responseBody = response.Content.ReadAsStringAsync().Result;

                if (!response.IsSuccessStatusCode)
                {
                    throw new HttpRequestException(string.Format("Reason: {0}. Response body: {1}.", response.ReasonPhrase, responseBody));
                }

                var jsSerializer = new JavaScriptSerializer();
                return jsSerializer.Deserialize<TResponse>(responseBody);
            }
        }
    }
}