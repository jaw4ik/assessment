using System;
using System.Activities.Expressions;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionResults;
using easygenerator.Web.Components.BundleTransforms;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Components.ActionFilters
{
    [TestClass]
    public class CustomRequireHttpsAttributeTest
    {

        private readonly Uri _httpUri = new Uri("http://test.com/");
        private readonly Uri _httpsUri = new Uri("https://test.com/");

        private IAuthorizationFilter _customRequireHttpsAttribute;

        private AuthorizationContext _authorizationContext;
        private HttpRequestBase _httpRequest;
        
        [TestInitialize]
        public void InitializeContext()
        {
            _customRequireHttpsAttribute = new CustomRequireHttpsAttribute();

            _authorizationContext = Substitute.For<AuthorizationContext>();
            _httpRequest = Substitute.For<HttpRequestBase>();
            

            _authorizationContext.HttpContext = Substitute.For<HttpContextBase>();
            _authorizationContext.HttpContext.Request.Returns(_httpRequest);

            _authorizationContext.ActionDescriptor = Substitute.For<ActionDescriptor>();
            
            ControllerDescriptor _controllerDescriptor = Substitute.For<ControllerDescriptor>();
            _authorizationContext.ActionDescriptor.ControllerDescriptor.Returns(_controllerDescriptor);
        }

        #region OnAuthorization

        [TestMethod]
        public void OnAuthorization_ShouldThrowArgumentNullException_WhenFilterContextIsNull()
        {
            //Arrange

            //Act
            Action action = () => _customRequireHttpsAttribute.OnAuthorization(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>();
        }

        [TestMethod]
        public void OnAuthorization_ShouldNotSetActionResult_WhenIsUrlSchemeIsHttps()
        {
            //Arrange
            _httpRequest.Url.Returns(_httpsUri);
            _httpRequest.IsSecureConnection.Returns(true);

            //Act
            _customRequireHttpsAttribute.OnAuthorization(_authorizationContext);

            //Assert
            _authorizationContext.Result.Should().NotBeOfType<SslRequiredResult>();
        }

        [TestMethod]
        public void OnAuthorization_ShouldSetForbiddenActionResult_WhenIsUrlSchemeIsHttp()
        {
            //Arrange
            _httpRequest.Url.Returns(_httpUri);
            _httpRequest.IsSecureConnection.Returns(false);
            
            //Act
            _customRequireHttpsAttribute.OnAuthorization(_authorizationContext);

            //Assert
            _authorizationContext.Result.Should().BeOfType<SslRequiredResult>();
        }

        #endregion
    }
}
