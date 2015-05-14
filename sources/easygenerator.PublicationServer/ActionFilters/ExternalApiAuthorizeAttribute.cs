using easygenerator.PublicationServer.Configuration;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace easygenerator.PublicationServer.ActionFilters
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false, Inherited = true)]

    public class ExternalApiAuthorizeAttribute : AuthorizationFilterAttribute
    {
        public ConfigurationReader ConfigurationReader { get; set; }
        private const string QueryParamName = "key";

        public override void OnAuthorization(HttpActionContext actionContext)
        {
            var queryString = actionContext.Request.GetQueryNameValuePairs().ToDictionary(x => x.Key, x => x.Value);

            if (!queryString.ContainsKey(QueryParamName) || queryString[QueryParamName].Trim() != ConfigurationReader.ApiKey.Trim())
            {
                actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Forbidden, "Key is not correct");
            }
        }
    }
}
