using System;
using System.Web;
using System.Web.Mvc;

namespace easygenerator.Web.Components
{
    public interface IUrlHelperWrapper
    {
        string RouteWebsiteUrl();
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

        public string ToAbsoluteUrl(string relativeUrl)
        {
            return string.Format("{0}{1}", RouteWebsiteUrl(), VirtualPathUtility.ToAbsolute(relativeUrl).TrimStart('/'));
        }

        public string RouteRestorePasswordUrl(string ticketId)
        {
            return new UrlHelper(HttpRequest.RequestContext).RouteUrl("PasswordRecovery", new { ticketId = ticketId }, HttpRequest.Url.Scheme);
        }
    }
}