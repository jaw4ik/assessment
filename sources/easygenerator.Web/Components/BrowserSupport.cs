using System;
using System.Globalization;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Configuration;

namespace easygenerator.Web.Components
{
    public static class BrowserSupport
    {
        public static bool IsFullySupportedBrowser(string userAgent, HttpBrowserCapabilities browser)
        {
            if (String.IsNullOrEmpty(userAgent))
            {
                return true;
            }
            var ua = userAgent.ToLower();
            return IsSupportedDesktop(ua, browser) || IsSupportedMobile(ua);
        }

        public static bool IsPartiallySupportedBrowser(string userAgent, HttpBrowserCapabilities browser)
        {
            var ua = userAgent.ToLower();
            var version = "";
            if (!browser.Type.ToUpper().Contains("IE"))
            {
                return true;
            }
            version = Regex.Match(browser.Version, @"[\d]+(\.[\d]+)?").ToString();
            if (version.Length == 0)
            {
                return false;
            }
            return Double.Parse(version, CultureInfo.InvariantCulture) >= 9;
        }

        public static bool IsSupportedDevice(string userAgent)
        {
            if (String.IsNullOrEmpty(userAgent))
            {
                return true;
            }
            var ua = userAgent.ToLower();
            var version = "";
            if (IsIos(ua))
            {
                version = Regex.Match(ua, @" [\d]+_").ToString();
                if (version.Length == 0)
                {
                    return false;
                }
                version = version.Substring(1).Replace("_", "");
                return Int32.Parse(version) >= 6;
            }
            if (!IsAndroid(ua))
            {
                return true;
            }
            version = Regex.Match(ua, @"android [\d]+(\.[\d]+)?").ToString();
            if (version.Length < 9)
            {
                return false;
            }
            version = version.Substring(8);
            return Double.Parse(version, CultureInfo.InvariantCulture) >= 4.4;
        }

        private static bool IsSupportedDesktop(string ua, HttpCapabilitiesBase browser)
        {
            var version = "";
            if (IsAndroid(ua) || IsIos(ua))
            {
                return false;
            }
            if (IsMac(ua))
            {
                return Regex.Match(ua, @"opr|opera|firefox").Length == 0;
            }
            if (ua.Contains("rv:11.0"))
            {
                return true;
            }
            if (ua.Contains("firefox"))
            {
                version = Regex.Match(browser.Version, @"[\d]+(\.[\d]+)?").ToString();
                if (version.Length == 0)
                {
                    return false;
                }
                return Double.Parse(version, CultureInfo.InvariantCulture) >= 22;
            }
            if (ua.Contains("opr"))
            {
                return false;
            }
            if (ua.Contains("phantomjs"))
            {
                return true;
            }
            if (!ua.Contains("chrome"))
            {
                return false;
            }

            version = Regex.Match(browser.Version, @"[\d]+(\.[\d]+)?").ToString();
            if (version.Length == 0)
            {
                return false;
            }
            return Double.Parse(version, CultureInfo.InvariantCulture) >= 28;
        }

        private static bool IsSupportedMobile(string ua)
        {
            var version = "";
            if (IsIos(ua))
            {
                version = Regex.Match(ua, @" [\d]+_").ToString();
                if (version.Length == 0)
                {
                    return false;
                }
                version = version.Substring(1).Replace("_", "");
                return Int32.Parse(version) >= 6 && Regex.Match(ua, @"(opr|opera|firefox|chrome|crios)").Length == 0;
            }
            if (!IsAndroid(ua)) return false;

            version = Regex.Match(ua, @"android [\d]+(\.[\d]+)?").ToString();
            if (version.Length < 9)
            {
                return false;
            }
            version = version.Substring(8);
            return Double.Parse(version, CultureInfo.InvariantCulture) >= 4.4 && Regex.Match(ua, @"(opr|opera|firefox)").Length == 0;
        }

        private static bool IsIos(string ua)
        {
            return Regex.Match(ua, @"(ipad|iphone|ipod)").Length != 0;
        }

        private static bool IsMac(string ua)
        {
            return Regex.Match(ua, @"(macintosh|mac os)").Length != 0;
        }

        private static bool IsAndroid(string ua)
        {
            return ua.Contains("android");
        }

    }
}