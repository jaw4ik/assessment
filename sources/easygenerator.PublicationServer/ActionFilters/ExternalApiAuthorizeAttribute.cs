using easygenerator.PublicationServer.Configuration;
using System;
using System.Net;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace easygenerator.PublicationServer.ActionFilters
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]

    public class ExternalApiAuthorizeAttribute : AuthorizationFilterAttribute
    {
        public ConfigurationReader ConfigurationReader { get; set; }
        private const string KeyHeaderName = "key";

        public override void OnAuthorization(HttpActionContext actionContext)
        {
            var keyValues = actionContext.Request.Headers?.GetValues(KeyHeaderName) as string[];

            if (keyValues == null || keyValues.Length != 1 || keyValues[0].Trim() != ConfigurationReader.ApiKey.Trim())
            {
                actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Forbidden, "Key is not correct");
            }
        }
    }
}
