using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using System.Web.Mvc;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Extensions;
using easygenerator.Web.Components.ActionFilters.Permissions;
using Newtonsoft.Json;

namespace easygenerator.Web.Controllers.Api
{

    [AllowAnonymous]
    public class ProxyRequestController : DefaultApiController
    {
        // GET: ProxyRequest
        [HttpGet]
        [Route("api/proxyGet")]
        public async Task<ActionResult> ProxyGet(string url)
        {
            string parseResult = null;
            using (HttpClient client = new HttpClient())
                using (HttpResponseMessage response = await client.GetAsync(url))
                    using (HttpContent content = response.Content)
                        parseResult = await content.ReadAsStringAsync();
                
            return JsonSuccess(parseResult);
        }

        [HttpPost]
        [Route("api/proxyPost")]
        public async Task<ActionResult> ProxyPost(string url)
        {
            string parseResult = null;
            StringContent content = new StringContent(JsonConvert.SerializeObject(url), Encoding.UTF8, "application/x-www-form-urlencoded");
            using (HttpClient client = new HttpClient())
                using (HttpResponseMessage response = await client.PostAsync(url, content))
                    using (HttpContent httpContent = response.Content)
                        parseResult = await httpContent.ReadAsStringAsync();

            return JsonSuccess(parseResult);
        }
    }
}