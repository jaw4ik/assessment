using System;
using System.Web;
using System.Web.Mvc;

namespace easygenerator.Web.Components
{
    public interface IUrlHelperWrapper
    {
        string RouteWebsiteUrl();
        string RouteImageUrl(string fileName);
        string RouteRestorePasswordUrl(string ticketId);

        string ToAbsoluteUrl(string relativeUrl);
    }

    public class UrlHelperWrapper : IUrlHelperWrapper
    {
        public HttpRequest HttpRequest
        {
            get { return HttpContext.Current.Request; }
        }

        public string RouteWebsiteUrl()
        {
            return String.Format("{0}://{1}{2}", HttpRequest.Url.Scheme, HttpRequest.Url.Authority, new UrlHelper(HttpRequest.RequestContext).Content("~"));
        }

        public string RouteImageUrl(string fileName)
        {
            return RouteUrlWithUrlHelper("ImageUrl", new { fileName });
        }

        public string RouteRestorePasswordUrl(string ticketId)
        {
            return RouteUrlWithUrlHelper("PasswordRecovery", new { ticketId });
        }

        public string ToAbsoluteUrl(string relativeUrl)
        {
            return string.Format("{0}{1}", RouteWebsiteUrl(), VirtualPathUtility.ToAbsolute(relativeUrl).TrimStart('/'));
        }

        private string RouteUrlWithUrlHelper(string routeName, object routeValues)
        {
            return new UrlHelper(HttpRequest.RequestContext).RouteUrl(routeName, routeValues, HttpRequest.Url.Scheme);
        }
    }
}