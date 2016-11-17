using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
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
    //[EntityOwner(typeof(Course))]
    [AllowAnonymous]
    public class LinkRequestController : DefaultApiController
    {
        private string ToQueryString(NameValueCollection nvc)
        {
            var array = (from key in nvc.AllKeys
                         from value in nvc.GetValues(key)
                         select $"{HttpUtility.UrlEncode(key)}={value}")
                .ToArray();
            return "?" + string.Join("&", array);
        }

        [HttpGet]
        [Route("api/linkRequest/parse")]     
        public async Task<ActionResult> Parse(string url)
        {
            //TODO: HIDE pattern string
            //TODO: ask where to hide
            string pattern = @"^(http|https|ftp|)\://|[a-zA-Z0-9\-\.]+\.[a-zA-Z](:[a-zA-Z0-9]*)?/?([a-zA-Z0-9\-\._\?\,\'/\\\+&amp;%\$#\=~])*[^\.\,\)\(\s]$";
            Regex reg = new Regex(pattern, RegexOptions.Compiled | RegexOptions.IgnoreCase);

            if (reg.IsMatch(url)) {
                NameValueCollection urlNvc = HttpUtility.ParseQueryString(String.Empty);
                //TODO: try to change random method on uniqueid or guid
                //TODO: ask about how they are retrun a values with specific status code
                urlNvc["apikey"] = "a7787324-4e88-4b2c-87a7-904f22cbf38d";
                urlNvc["pretty"] = "true";
                urlNvc["id"] = new Random().Next(0, 1023).ToString();
                urlNvc["lang"] = "ru";
                urlNvc["only_errors"] = "false";
                urlNvc["url"] = url;

                url = @"https://validator-api.semweb.yandex.ru/v1.1/url_parser" + ToQueryString(urlNvc);
                string parseResult;

                using (HttpClient client = new HttpClient())
                    using (HttpResponseMessage response = await client.GetAsync(url))
                        using (HttpContent content = response.Content) { 
                            parseResult = await content.ReadAsStringAsync();
                        }
                return JsonSuccess(parseResult);
                
                //logger here
            }
            return JsonError(Errors.NotValidUrl);
        }
    }
}