using System.Collections.Generic;
using System.Web;
using easygenerator.Web.Components;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.Web.Tests.Components
{
    [TestClass]
    public class BrowserSupportTest
    {
        private HttpBrowserCapabilities _browser;
        private string _ua;

        private void _InitFakeBrowser(string type, string version)
        {
            _browser = new HttpBrowserCapabilities
            {
                Capabilities = new Dictionary<string, string> { { "version", version }, { "type", type } }
            };
        }

        [TestMethod]
        public void BrowserSupport_IsFullySupportedBrowserWhenUserAgentIsNULL_ShouldReturnTrue()
        {
            _ua = null;
            _InitFakeBrowser("Chrome", "41");
            Assert.AreEqual(BrowserSupport.IsFullySupportedBrowser(_ua, _browser), true);
        }

        [TestMethod]
        public void BrowserSupport_IsFullySupportedBrowserWhenUserAgentIsEmpty_ShouldReturnTrue()
        {
            _ua = "";
            _InitFakeBrowser("Chrome", "41");
            Assert.AreEqual(BrowserSupport.IsFullySupportedBrowser(_ua, _browser), true);
        }

        [TestMethod]
        public void BrowserSupport_IsFullySupportedBrowserWhenUserAgentIsIncorrect_ShouldReturnFalse()
        {
            _ua = "это мой браузер";
            _InitFakeBrowser("Chrome", "41");
            Assert.AreEqual(BrowserSupport.IsFullySupportedBrowser(_ua, _browser), false);
        }

        [TestMethod]
        public void BrowserSupport_IsFullySupportedBrowserWhenBrowserTypeIsIncorrect_ShouldReturnFalse()
        {
            _ua = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36";
            _InitFakeBrowser("MyBrowser", "1");
            Assert.AreEqual(BrowserSupport.IsFullySupportedBrowser(_ua, _browser), false);
        }

        [TestMethod]
        public void BrowserSupport_IsFullySupportedBrowserWhenBrowserVersionIsIncorrect_ShouldReturnFalse()
        {
            _ua = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36";
            _InitFakeBrowser("Chrome", "version");
            Assert.AreEqual(BrowserSupport.IsFullySupportedBrowser(_ua, _browser), false);
        }

        [TestMethod]
        public void BrowserSupport_IsFullySupportedBrowserWhenBrowserIsOldChromeVersion_ShouldReturnFalse()
        {
            _ua = "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1500.55 Safari/537.36";
            _InitFakeBrowser("Chrome", "27");
            Assert.AreEqual(BrowserSupport.IsFullySupportedBrowser(_ua, _browser), false);
        }

        [TestMethod]
        public void BrowserSupport_IsFullySupportedBrowserWhenBrowserIsSupportedChromeVersion_ShouldReturnTrue()
        {
            _ua = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36";
            _InitFakeBrowser("Chrome", "41");
            Assert.AreEqual(BrowserSupport.IsFullySupportedBrowser(_ua, _browser), true);
        }

        [TestMethod]
        public void BrowserSupport_IsFullySupportedBrowserWhenBrowserIsOldFirefoxVersion_ShouldReturnFalse()
        {
            _ua = "Mozilla/5.0 (Windows NT 6.2; Win64; x64; rv:21.0.0) Gecko/20121011 Firefox/21.0.0";
            _InitFakeBrowser("Firefox", "21.0.0");
            Assert.AreEqual(BrowserSupport.IsFullySupportedBrowser(_ua, _browser), false);
        }

        [TestMethod]
        public void BrowserSupport_IsFullySupportedBrowserWhenBrowserIsSupportedFirefoxVersion_ShouldReturnTrue()
        {
            _ua = "Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0";
            _InitFakeBrowser("Firefox", "36.0");
            Assert.AreEqual(BrowserSupport.IsFullySupportedBrowser(_ua, _browser), true);
        }

        [TestMethod]
        public void BrowserSupport_IsFullySupportedBrowserWhenBrowserIsIE11_ShouldReturnTrue()
        {
            _ua = "Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko";
            _InitFakeBrowser("IE", "11.0");
            Assert.AreEqual(BrowserSupport.IsFullySupportedBrowser(_ua, _browser), true);
        }

        [TestMethod]
        public void BrowserSupport_IsFullySupportedBrowserWhenBrowserIsIElt11_ShouldReturnFalse()
        {
            _ua = "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0";
            _InitFakeBrowser("IE", "10.0");
            Assert.AreEqual(BrowserSupport.IsFullySupportedBrowser(_ua, _browser), false);
        }

        [TestMethod]
        public void BrowserSupport_IsFullySupportedBrowserWhenDeviseIsWindowsAndBrowserIsSafari_ShouldReturnFalse()
        {
            _ua = "Mozilla/5.0 (Windows; U; Windows NT 6.1; sv-SE) AppleWebKit/533.19.4 (KHTML, like Gecko) Version/5.0.3 Safari/533.19.4";
            _InitFakeBrowser("Safari", "5.0.3");
            Assert.AreEqual(BrowserSupport.IsFullySupportedBrowser(_ua, _browser), false);
        }

        [TestMethod]
        public void BrowserSupport_IsFullySupportedBrowserWhenDeviseIsMacAndBrowserIsSafari_ShouldReturnTrue()
        {
            _ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A";
            _InitFakeBrowser("Safari", "7.0.3");
            Assert.AreEqual(BrowserSupport.IsFullySupportedBrowser(_ua, _browser), true);
        }

        [TestMethod]
        public void BrowserSupport_IsFullySupportedBrowserWhenDeviseIsMacAndBrowserIsChrome_ShouldReturnTrue()
        {
            _ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36";
            _InitFakeBrowser("Chrome", "41.0.2227.1");
            Assert.AreEqual(BrowserSupport.IsFullySupportedBrowser(_ua, _browser), true);
        }

        [TestMethod]
        public void BrowserSupport_IsFullySupportedBrowserWhenDeviseIsMacAndBrowserIsNotSafariOrChrome_ShouldReturnFalse()
        {
            _ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10; rv:33.0) Gecko/20100101 Firefox/33.0";
            _InitFakeBrowser("Firefox", "33.0");
            Assert.AreEqual(BrowserSupport.IsFullySupportedBrowser(_ua, _browser), false);
        }

        [TestMethod]
        public void BrowserSupport_IsFullySupportedBrowserWhenDeviseIsIosAndBrowserIsSafari_ShouldReturnTrue()
        {
            _ua = "Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5355d Safari/8536.25";
            _InitFakeBrowser("Safari", "6.0");
            Assert.AreEqual(BrowserSupport.IsFullySupportedBrowser(_ua, _browser), true);
        }

        [TestMethod]
        public void BrowserSupport_IsFullySupportedBrowserWhenDeviseIsIosAndBrowserIsNotSafari_ShouldReturnFalse()
        {
            _ua = "Mozilla/5.0 (iPhone; U; CPU iPhone OS 7_1_1 like Mac OS X; en-gb) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3";
            _InitFakeBrowser("Chrome", "41");
            Assert.AreEqual(BrowserSupport.IsFullySupportedBrowser(_ua, _browser), false);
        }

        [TestMethod]
        public void BrowserSupport_IsFullySupportedBrowserWhenDeviseIsAndroidAndBrowserIsChromeOrNative_ShouldReturnTrue()
        {
            _ua = "Mozilla/5.0 (Linux; Android 4.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19";
            _InitFakeBrowser("Chrome", "41");
            Assert.AreEqual(BrowserSupport.IsFullySupportedBrowser(_ua, _browser), true);
        }

        [TestMethod]
        public void BrowserSupport_IsFullySupportedBrowserWhenDeviseIsAndroidAndBrowserIsNotChromeOrNative_ShouldReturnFalse()
        {
            _ua = "Mozilla/5.0 (Android 4.4; Mobile; rv:24.0) Gecko/24.0 Firefox/24.0";
            _InitFakeBrowser("Firefox", "24");
            Assert.AreEqual(BrowserSupport.IsFullySupportedBrowser(_ua, _browser), false);
        }

        [TestMethod]
        public void BrowserSupport_IsPartiallySupportedBrowser_WhenBrowserVersionIsEmpty_ShouldReturnFalse()
        {
            _ua = "Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko";
            _InitFakeBrowser("IE", "");
            Assert.AreEqual(BrowserSupport.IsPartiallySupportedBrowser(_ua, _browser), false);
        }

        [TestMethod]
        public void BrowserSupport_IsPartiallySupportedBrowser_WhenBrowserTypeIsIEAndBrowserVersionLt9_ShouldReturnFalse()
        {
            _ua = "Mozilla/5.0 (compatible; MSIE 6.0; Windows NT 6.1; WOW64; Trident/6.0";
            _InitFakeBrowser("IE", "6");
            Assert.AreEqual(BrowserSupport.IsPartiallySupportedBrowser(_ua, _browser), false);
        }

        [TestMethod]
        public void BrowserSupport_IsPartiallySupportedBrowser_WhenBrowserIsSupported_ShouldReturnTrue()
        {
            _ua = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36";
            _InitFakeBrowser("Chrome", "41");
            Assert.AreEqual(BrowserSupport.IsPartiallySupportedBrowser(_ua, _browser), true);
        }

        [TestMethod]
        public void BrowserSupport_IsPartiallySupportedBrowser_WhenBrowserIsNotSupportedAndCanStartApp_ShouldReturnTrue()
        {
            _ua = "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/6.0";
            _InitFakeBrowser("IE", "9");
            Assert.AreEqual(BrowserSupport.IsPartiallySupportedBrowser(_ua, _browser), true);
        }

        [TestMethod]
        public void BrowserSupport_IsSupportedDevice_WhenUserAgentStringIsNULL_ShouldReturnTrue()
        {
            _ua = null;
            _InitFakeBrowser("Chrome", "41");
            Assert.AreEqual(BrowserSupport.IsSupportedDevice(_ua), true);
        }

        [TestMethod]
        public void BrowserSupport_IsSupportedDevice_WhenUserAgentStringIsEmpty_ShouldReturnTrue()
        {
            _ua = "";
            _InitFakeBrowser("Chrome", "41");
            Assert.AreEqual(BrowserSupport.IsSupportedDevice(_ua), true);
        }

        [TestMethod]
        public void BrowserSupport_IsSupportedDevice_WhenDeviceIsSupported_ShouldReturnTrue()
        {
            _ua = "Mozilla/5.0 (Linux; Android 4.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19";
            _InitFakeBrowser("Chrome", "41");
            Assert.AreEqual(BrowserSupport.IsSupportedDevice(_ua), true);
        }

        [TestMethod]
        public void BrowserSupport_IsSupportedDevice_WhenDeviceIsOldAndroidVersion_ShouldReturnFalse()
        {
            _ua = "Mozilla/5.0 (Linux; Android 4.2.2; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19";
            _InitFakeBrowser("Chrome", "41");
            Assert.AreEqual(BrowserSupport.IsSupportedDevice(_ua), false);
        }

        [TestMethod]
        public void BrowserSupport_IsSupportedDevice_WhenDeviceIsOldIosVersion_ShouldReturnFalse()
        {
            _ua = "Mozilla/5.0 (iPad; CPU OS 5_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5355d Safari/8536.25";
            _InitFakeBrowser("Safari", "6.0");
            Assert.AreEqual(BrowserSupport.IsSupportedDevice(_ua), false);
        }

    }
}
