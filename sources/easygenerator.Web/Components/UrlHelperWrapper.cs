using System;
using System.Web;
using System.Web.Mvc;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.Components
{
    public interface IUrlHelperWrapper
    {
        string RouteWebsiteUrl();
        string RouteImageUrl(string fileName);
        string RouteRestorePasswordUrl(string ticketId);

        string ToAbsoluteUrl(string relativeUrl);

        string AddCurrentSchemeToUrl(string url);
        string RemoveSchemeFromUrl(string url);
    }

    public class UrlHelperWrapper : IUrlHelperWrapper
    {
        private readonly ConfigurationReader _configurationReader;

        public UrlHelperWrapper(ConfigurationReader configurationReader)
        {
            _configurationReader = configurationReader;
        }

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
            return new UrlHelper(HttpRequest.RequestContext).RouteUrl(routeName, routeValues, _configurationReader.ImageLibraryOnlyHttps ? Uri.UriSchemeHttps : HttpRequest.Url.Scheme);
        }

        public string AddCurrentSchemeToUrl(string url)
        {
            if (string.IsNullOrEmpty(url) || url.Contains("://"))
            {
                return url;
            }

            var scheme = HttpRequest.Url.Scheme + ":";
            return url.StartsWith("//") ? scheme + url : scheme + "//" + url;
        }

        public string RemoveSchemeFromUrl(string url)
        {
            if (string.IsNullOrEmpty(url))
            {
                return url;
            }

            var index = url.IndexOf("://");
            return (index < 0) ? url : url.Substring(index + 1);
        }
    }
}