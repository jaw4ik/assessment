using System;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Components;
using easygenerator.Web.Publish;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Publish
{
    [TestClass]
    public class PublishUrlResolverTests
    {
        private HttpContextWrapper _httpContext;
        private PublishUrlResolver _urlResolver;

        [TestInitialize]
        public void InitializePublisher()
        {
            _httpContext = Substitute.For<HttpContextWrapper>();
            _urlResolver = new PublishUrlResolver(_httpContext);
        }

        #region AddCurrentSchemeToUrl

        [TestMethod]
        public void AddCurrentSchemeToUrl_IfUrlHasSchemeShouldReturnUrl()
        {
            //Arrange
            var url = "http://test";
            //Act
            var result = _urlResolver.AddCurrentSchemeToUrl(url);

            //Assert
            result.Should().Be(url);
        }

        [TestMethod]
        public void AddCurrentSchemeToUrl_IfUrlStartWithSlashesAndCurrentSchemeIsHttpShouldReturnUrlWithHttp()
        {
            //Arrange
            var url = "//test";
            _httpContext.GetCurrentScheme().Returns("http");
            //Act
            var result = _urlResolver.AddCurrentSchemeToUrl(url);

            //Assert
            result.Should().Be("http://test");
        }

        [TestMethod]
        public void AddCurrentSchemeToUrl_IfUrlStartWithSlashesAndCurrentSchemeIsHttpsShouldReturnUrlWithHttps()
        {
            //Arrange
            var url = "//test";
            _httpContext.GetCurrentScheme().Returns("https");
            //Act
            var result = _urlResolver.AddCurrentSchemeToUrl(url);

            //Assert
            result.Should().Be("https://test");
        }

        [TestMethod]
        public void AddCurrentSchemeToUrl_IfUrlIfUrlDoesNotHaveSchemeAndCurrentSchemeIsHttpShouldReturnUrlWithHttp()
        {
            //Arrange
            var url = "test";
            _httpContext.GetCurrentScheme().Returns("http");
            //Act
            var result = _urlResolver.AddCurrentSchemeToUrl(url);

            //Assert
            result.Should().Be("http://test");
        }

        [TestMethod]
        public void AddCurrentSchemeToUrl_IfUrlDoesNotHaveSchemeAndCurrentSchemeIsHttpsShouldReturnUrlWithHttps()
        {
            //Arrange
            var url = "test";
            _httpContext.GetCurrentScheme().Returns("https");
            //Act
            var result = _urlResolver.AddCurrentSchemeToUrl(url);

            //Assert
            result.Should().Be("https://test");
        }

        #endregion

        #region RemoveSchemeFromUrl

        [TestMethod]
        public void RemoveSchemeFromUrl_IfUrlHasHttpShouldReturnUrlWithoutScheme()
        {
            //Arrange
            var url = "http://test";

            //Act
            var result = _urlResolver.RemoveSchemeFromUrl(url);

            //Assert
            result.Should().Be("//test");
        }

        [TestMethod]
        public void RemoveSchemeFromUrl_IfUrlHasHttpsShouldReturnUrlWithoutScheme()
        {
            //Arrange
            var url = "https://test";

            //Act
            var result = _urlResolver.RemoveSchemeFromUrl(url);

            //Assert
            result.Should().Be("//test");
        }

        [TestMethod]
        public void RemoveSchemeFromUrl_IfUrlHasOtherSchemeShouldReturnUrlWithoutScheme()
        {
            //Arrange
            var url = "test://test";

            //Act
            var result = _urlResolver.RemoveSchemeFromUrl(url);

            //Assert
            result.Should().Be("//test");
        }

        [TestMethod]
        public void RemoveSchemeFromUrl_IfUrlDoesNotHaveSchemeShouldReturnUrl()
        {
            //Arrange
            var url = "//test";
            _httpContext.GetCurrentScheme().Returns("http");

            //Act
            var result = _urlResolver.RemoveSchemeFromUrl(url);

            //Assert
            result.Should().Be(url);
        }
        #endregion
    }
}
