using System;
using System.Web;
using System.Web.Mvc;

namespace easygenerator.Web.Components
{
    public interface IUrlHelperWrapper
    {
        string RouteWebsiteUrl();
        string RouteRestorePasswordUrl(string ticketId);
    }

    public class UrlHelperWrapper : IUrlHelperWrapper
    {
        private readonly UrlHelper _urlHelper;

        public HttpRequest HttpRequest
        {
            get { return HttpContext.Current.Request; }
        }

        public UrlHelperWrapper()
        {
            _urlHelper = new UrlHelper(HttpRequest.RequestContext);
        }

        public string RouteWebsiteUrl()
        {
            return String.Format("{0}://{1}{2}", HttpRequest.Url.Scheme, HttpRequest.Url.Authority, _urlHelper.Content("~"));
        }

        public string RouteRestorePasswordUrl(string ticketId)
        {
            return _urlHelper.RouteUrl("PasswordRecovery", new { ticketId = ticketId }, HttpRequest.Url.Scheme);
        }
    }
}