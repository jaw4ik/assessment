using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Web;
using Newtonsoft.Json;
using System.Net.Http;
using System.Text;

namespace easygenerator.Infrastructure.Http
{
    public class HttpClient
    {
        public virtual string Post(string url, object postData, string userName = null, string password = null)
        {
            var postJsonData = JsonConvert.SerializeObject(postData);
            return DoHttpAction(url, postJsonData, client => client.PostAsync(url, new StringContent(postJsonData, Encoding.UTF8, "application/json")).Result, userName, password);
        }
        public virtual TResponse Post<TResponse>(string url, object postData, string userName = null, string password = null)
        {
            return Post<TResponse>(url, JsonConvert.SerializeObject(postData), userName, password);
        }

        public virtual TResponse PostForm<TResponse>(string url, IEnumerable<KeyValuePair<string, string>> formValues, string userName = null, string password = null)
        {
            return DoHttpAction<TResponse>(url, String.Join("; ", formValues.Select(_ => $"{_.Key}: {_.Value}")), client => client.PostAsync(url, new FormUrlEncodedContent(formValues)).Result, userName, password);
        }

        public virtual TResponse Post<TResponse>(string url, string postJsonData, string userName = null, string password = null)
        {
            return Deserialize<TResponse>(DoHttpAction(url, postJsonData, client => client.PostAsync(url, new StringContent(postJsonData, Encoding.UTF8, "application/json")).Result, userName, password));
        }

        public virtual TResponse Get<TResponse>(string url, Dictionary<string, string> queryStringParameters, string userName = null, string password = null)
        {
            return Deserialize<TResponse>(DoHttpAction(url, null, client => client.GetAsync(BuildUrl(url, queryStringParameters)).Result, userName, password));
        }

        public virtual TResponse Get<TResponse>(string url, Dictionary<string, string> queryStringParameters, Dictionary<string, string> headers, string userName = null, string password = null)
        {
            var requestMessage = BuildRequestMessage(HttpMethod.Get, BuildUrl(url, queryStringParameters), headers);
            return Deserialize<TResponse>(DoHttpAction(url, null, client => client.SendAsync(requestMessage).Result, userName, password));
        }

        public virtual TResponse PostFile<TResponse>(string url, string fileName, byte[] fileData)
        {
            using (var client = InitializeHttpClient())
            {
                var fileContent = new ByteArrayContent(fileData);
                fileContent.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment") { FileName = fileName };

                using (var content = new MultipartFormDataContent())
                {

                    content.Add(fileContent);

                    HttpResponseMessage response = client.PostAsync(url, content).Result;
                    string responseBody = response.Content.ReadAsStringAsync().Result;
                    if (!response.IsSuccessStatusCode)
                    {
                        throw new HttpRequestException(
                            $"Reason: {response.ReasonPhrase}. Response body: {responseBody}.");
                    }
                    return JsonConvert.DeserializeObject<TResponse>(responseBody);
                }
            }
        }

        public virtual void PostFileInChunks(string url, string fileName, byte[] fileData, string userName = null, string password = null, Dictionary<string, string> fileChunkHeaders = null)
        {
            var chunks = new Dictionary<int, byte[]>();
            var chunksCounter = 0;
            const int bufferSize = 100 * 1024;

            while (chunksCounter * bufferSize < fileData.Length)
            {
                chunks.Add(chunksCounter + 1, fileData.Skip(chunksCounter * bufferSize).Take(bufferSize).ToArray());
                chunksCounter++;
            }

            using (var client = InitializeHttpClient(userName, password))
            {
                while (chunks.Any())
                {
                    var chunk = chunks.First();
                    var fileContent = new ByteArrayContent(chunk.Value);
                    fileContent.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment") { FileName = fileName };
                    fileContent.Headers.Add("ChunkId", chunk.Key.ToString("d8"));
                    fileContent.Headers.Add("IsCompleted", chunks.Count() == 1 ? "true" : "false");

                    if (fileChunkHeaders != null)
                    {
                        foreach (var header in fileChunkHeaders)
                        {
                            fileContent.Headers.Add(header.Key, header.Value);
                        }
                    }

                    using (var content = new MultipartFormDataContent())
                    {
                        content.Add(fileContent);

                        HttpResponseMessage response = client.PostAsync(url, content).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            chunks.Remove(chunk.Key);
                        }
                        else
                        {
                            string responseBody = response.Content.ReadAsStringAsync().Result;
                            throw new HttpRequestException(string.Format("Reason: {0}. Response body: {1}.",
                                response.ReasonPhrase, responseBody));
                        }
                    }
                }
            }
        }

        protected virtual string DoHttpAction(string url, string requestData, Func<System.Net.Http.HttpClient, HttpResponseMessage> getHttpResponseFunc, string userName = null, string password = null)
        {
            using (var client = InitializeHttpClient(userName, password))
            {
                HttpResponseMessage response = getHttpResponseFunc(client);
                string responseBody = response.Content.ReadAsStringAsync().Result;

                if (!response.IsSuccessStatusCode)
                {
                    throw new HttpRequestExceptionExtended(url, requestData, response.RequestMessage.ToString(), response.StatusCode,
                        response.ReasonPhrase, responseBody);
                }

                return responseBody;
            }
        }

        protected virtual TResponse Deserialize<TResponse>(string content)
        {
            return JsonConvert.DeserializeObject<TResponse>(content);
        }

        protected virtual System.Net.Http.HttpClient InitializeHttpClient(string userName = null, string password = null)
        {
            var client = new System.Net.Http.HttpClient(new HttpClientHandler() { UseProxy = false }) { Timeout = new TimeSpan(0, 2, 30) };
            if (!string.IsNullOrEmpty(userName) && !string.IsNullOrEmpty(password))
            {
                client.DefaultRequestHeaders.Authorization = GetBasicAuthenticationHeader(userName, password);
            }
            return client;
        }

        protected virtual string BuildUrl(string url, Dictionary<string, string> queryStringParameters)
        {
            var uriBuilder = new UriBuilder(url);
            if (queryStringParameters != null)
            {
                var query = HttpUtility.ParseQueryString(uriBuilder.Query);

                foreach (var queryStringParameter in queryStringParameters)
                {
                    query[queryStringParameter.Key] = queryStringParameter.Value;
                }

                uriBuilder.Query = query.ToString();
            }

            return uriBuilder.ToString();
        }

        protected virtual HttpRequestMessage BuildRequestMessage(HttpMethod method, string requestUrl, Dictionary<string, string> headers)
        {
            var requestMessage = new HttpRequestMessage(method, requestUrl);
            foreach (var header in headers)
            {
                requestMessage.Headers.Add(header.Key, header.Value);
            }
            return requestMessage;
        }

        protected virtual AuthenticationHeaderValue GetBasicAuthenticationHeader(string userName, string password)
        {
            string credentials = $"{userName}:{password}";
            string base64Credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes(credentials));
            return new AuthenticationHeaderValue("Basic", base64Credentials);
        }
    }
}
