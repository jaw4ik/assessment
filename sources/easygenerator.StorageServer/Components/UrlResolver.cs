using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.StorageServer.Components
{
    public static class UrlResolver
    {
        public static string AddCurrentScheme(string url)
        {
            if (url.Contains("://"))
            {
                return url;
            }

            var scheme = HttpContext.Current.Request.Url.Scheme + ":";
            return url.StartsWith("//") ? scheme + url : scheme + "//" + url;
        }

        public static string RemoveSchemeFromUrl(string url)
        {
            var index = url.IndexOf("://", StringComparison.Ordinal);
            return (index < 0) ? url : url.Substring(index + 1);
        }
    }
}