using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Components.Configuration.ExternalApi;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace easygenerator.Web.Tests.Components.ActionFilters.Authorization
{
    [TestClass]
    public class ExternalApiAuthorizeAttributeTests
    {
        private const string ApiKeyName = "key";
        private const string ApiKeyValue = "value";
        private IAuthorizationFilter _attribute;

        private AuthorizationContext _filterContext;
        private HttpRequestBase _httpRequest;
        private ConfigurationReader _configurationReader;
        private NameValueCollection _queryString;
        private ApiKeyCollection _configApiKeys;

        [TestInitialize]
        public void InitializeContext()
        {
            _filterContext = Substitute.For<AuthorizationContext>();
            _httpRequest = Substitute.For<HttpRequestBase>();
            _configurationReader = Substitute.For<ConfigurationReader>();
            _queryString = new NameValueCollection();
            _configApiKeys = new ApiKeyCollection();
            var externalApiSection = Substitute.For<ExternalApiSection>();

            _configurationReader.ExternalApi.Returns(externalApiSection);
            externalApiSection.ApiKeys.Returns(_configApiKeys);
            _filterContext.HttpContext = Substitute.For<HttpContextBase>();
            _filterContext.HttpContext.Request.Returns(_httpRequest);
            _httpRequest.QueryString.Returns(_queryString);
        }

        #region OnAuthorization

        [TestMethod]
        public void OnAuthorization_ShouldThrowArgumentNullException_WhenFilterContextIsNull()
        {
            //Arrange
            _attribute = new ExternalApiAuthorizeAttribute(ApiKeyName, _configurationReader);

            //Act
            Action action = () => _attribute.OnAuthorization(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>();
        }

        [TestMethod]
        public void OnAuthorization_ShouldNotSetResult_WhenResultIsAlreadySet()
        {
            //Arrange
            _attribute = new ExternalApiAuthorizeAttribute(ApiKeyName);
            _filterContext.Result = new HttpStatusCodeResult(HttpStatusCode.OK);

            //Act
            _attribute.OnAuthorization(_filterContext);

            //Assert
            _filterContext.Result.Should().BeHttpStatusCodeResultWithStatus((int)HttpStatusCode.OK);
        }

        [TestMethod]
        public void OnAuthorization_ShouldThrowInvalidOperationException_WhenRequestIsNull()
        {
            //Arrange
            _attribute = new ExternalApiAuthorizeAttribute(ApiKeyName, _configurationReader);
            _filterContext.HttpContext.Request.Returns(null as HttpRequestBase);

            //Act
            Action action = () => _attribute.OnAuthorization(_filterContext);

            //Assert
            action.ShouldThrow<InvalidOperationException>();
        }

        [TestMethod]
        public void OnAuthorization_ShouldThrowInvalidOperationException_WhenRequestQueryStringIsNull()
        {
            //Arrange
            _attribute = new ExternalApiAuthorizeAttribute(ApiKeyName, _configurationReader);
            _httpRequest.QueryString.Returns(null as NameValueCollection);

            //Act
            Action action = () => _attribute.OnAuthorization(_filterContext);

            //Assert
            action.ShouldThrow<InvalidOperationException>();
        }

        [TestMethod]
        public void OnAuthorization_ShouldSetForbiddenResult_WhenNoApiKeyWithTheSpecifiedKeyIsRegistered()
        {
            //Arrange
            _attribute = new ExternalApiAuthorizeAttribute(ApiKeyName, _configurationReader);
            _queryString.Add("key", ApiKeyValue);

            //Act
            _attribute.OnAuthorization(_filterContext);

            //Assert
            _filterContext.Result.Should().BeHttpStatusCodeResultWithStatus((int)HttpStatusCode.Forbidden);
        }

        #endregion
    }
}
