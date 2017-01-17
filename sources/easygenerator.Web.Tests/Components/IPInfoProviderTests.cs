using System.Collections.Specialized;
using System.Web;
using easygenerator.Web.Components;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using FluentAssertions;

namespace easygenerator.Web.Tests.Components
{
    [TestClass]
    public class IPInfoProviderTests
    {
        private IIPInfoProvider _ipInfoProvider;
        private NameValueCollection _serverVars;
        private HttpRequestBase _httpRequest;
        private HttpContextBase _httpContext;

        [TestInitialize]
        public void InitializeContext()
        {
            _serverVars = new NameValueCollection();
            _httpContext = Substitute.For<HttpContextBase>();
            _httpRequest = Substitute.For<HttpRequestBase>();
            _ipInfoProvider = new IPInfoProvider();
        }

        #region GetIP

        [TestMethod]
        public void GetIP_ShouldReturnRemoteAddrWithoutProxy()
        {
            const string _ip = "127.0.0.1";
            _serverVars.Remove("HTTP_X_FORWARDED_FOR");
            _serverVars.Add("REMOTE_ADDR", _ip);

            _httpRequest.ServerVariables.Returns(_serverVars);
            _httpContext.Request.Returns(_httpRequest);

            var ip = _ipInfoProvider.GetIP(_httpContext);
            ip.Should().Be(_ip);
        }

        [TestMethod]
        public void GetIP_ShouldReturnFirstForwardedUrlWithProxy()
        {
            const string _ips = "127.0.0.1,128.0.0.1";
            _serverVars.Add("HTTP_X_FORWARDED_FOR", _ips);
            _serverVars.Remove("REMOTE_ADDR");

            _httpRequest.ServerVariables.Returns(_serverVars);
            _httpContext.Request.Returns(_httpRequest);

            var ip = _ipInfoProvider.GetIP(_httpContext);
            ip.Should().Be("127.0.0.1");
        }

        #endregion
    }
}
