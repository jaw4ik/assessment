using System;
using easygenerator.Web.Components;

namespace easygenerator.Web.Publish
{
    public class PublishUrlResolver
    {
        private readonly HttpContextWrapper _httpContext;


        public PublishUrlResolver(HttpContextWrapper httpContext)
        {
            _httpContext = httpContext;
        }

        public string AddCurrentSchemeToUrl(string url)
        {
            if (url.Contains("://"))
            {
                return url;
            }

            var scheme = _httpContext.GetCurrentScheme() + ":";
            return url.StartsWith("//") ? scheme + url : scheme + "//" + url;
        }

        public string RemoveSchemeFromUrl(string url)
        {
            if (!url.Contains("://"))
            {
                return url;
            }
            
            var index = url.IndexOf("://");

            return (index < 0) ? url : url.Substring(index + 1);
        }
    }
}