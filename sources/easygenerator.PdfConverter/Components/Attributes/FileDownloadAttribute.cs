using System;
using System.Net.Http;
using System.Web.Http.Filters;
using Microsoft.Owin;

namespace easygenerator.PdfConverter.Components.Attributes
{
    public class FileDownloadAttribute : ActionFilterAttribute
    {
        private const string DomainName = "easygenerator.com";

        public FileDownloadAttribute(string cookieName = "fileDownload", string cookiePath = "/")
        {
            CookieName = cookieName;
            CookiePath = cookiePath;
        }

        public string CookieName { get; set; }
        public string CookiePath { get; set; }

        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            CheckAndHandleFileResult(actionExecutedContext);

            base.OnActionExecuted(actionExecutedContext);
        }

        private void CheckAndHandleFileResult(HttpActionExecutedContext actionExecutedContext)
        {
            var response = actionExecutedContext.Response;
            var cookies = actionExecutedContext.Request.GetOwinContext().Response.Cookies;

            if (response.Content is StreamContent)
            {
                var cookieOptions = new CookieOptions() { Path = CookiePath };
                if (actionExecutedContext.Request.RequestUri.Host.Contains(DomainName))
                {
                    cookieOptions.Domain = DomainName;
                }
                cookies.Append(CookieName, "true", cookieOptions);
            }
            else
            {
                cookies.Delete(CookieName);
            }
        }
    }
}