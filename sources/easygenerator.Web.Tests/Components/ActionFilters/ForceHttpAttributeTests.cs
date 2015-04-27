using System;
using System.Activities.Expressions;
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
    public class ForceHttpAttributeTests
    {

        private readonly Uri _httpUri = new Uri("http://test.com/");
        private readonly Uri _httpsUri = new Uri("https://test.com/");

        private IAuthorizationFilter _forceHttpAttribute;

        private AuthorizationContext _authorizationContext;
        private HttpRequestBase _httpRequest;
        
        [TestInitialize]
        public void InitializeContext()
        {
            _forceHttpAttribute = new ForceHttpAttribute();

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
            Action action = () => _forceHttpAttribute.OnAuthorization(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>();
        }

        [TestMethod]
        public void OnAuthorization_ShouldNotSetActionResult_WhenIsUrlSchemeIsHttp()
        {
            //Arrange
            _httpRequest.HttpMethod.Returns(HttpMethod.Get.Method);
            _httpRequest.Url.Returns(_httpUri);
            _httpRequest.IsSecureConnection.Returns(false);

            //Act
            _forceHttpAttribute.OnAuthorization(_authorizationContext);

            //Assert
            _authorizationContext.Result.Should().NotBeOfType<ForbiddenResult>();
        }

        [TestMethod]
        public void OnAuthorization_ShouldNotSetActionResult_WhenControllerHasRequireHttpsAttribute()
        {
            //Arrange
            _httpRequest.HttpMethod.Returns(HttpMethod.Get.Method);
            _httpRequest.Url.Returns(_httpsUri);
            _httpRequest.IsSecureConnection.Returns(true);

            Object[] attributes = new[] { new RequireHttpsAttribute() };
            _authorizationContext.ActionDescriptor.ControllerDescriptor.GetCustomAttributes(
                typeof(RequireHttpsAttribute), true).Returns(attributes);
            //Act
            _forceHttpAttribute.OnAuthorization(_authorizationContext);

            //Assert
            _authorizationContext.Result.Should().NotBeOfType<ForbiddenResult>();
        }

        [TestMethod]
        public void OnAuthorization_ShouldNotSetActionResult_WhenActionHasRequireHttpsAttribute()
        {
            //Arrange
            _httpRequest.HttpMethod.Returns(HttpMethod.Get.Method);
            _httpRequest.Url.Returns(_httpsUri);
            _httpRequest.IsSecureConnection.Returns(true);

            Object[] attributes = new[] { new RequireHttpsAttribute() };

            _authorizationContext.ActionDescriptor.GetCustomAttributes(
                typeof(RequireHttpsAttribute), true).Returns(attributes);
            //Act
            _forceHttpAttribute.OnAuthorization(_authorizationContext);

            //Assert
            _authorizationContext.Result.Should().NotBeOfType<ForbiddenResult>();
        }

        [TestMethod]
        public void OnAuthorization_ShouldNotSetActionResult_WhenControllerHasCustomRequireHttpsAttribute()
        {
            //Arrange
            _httpRequest.HttpMethod.Returns(HttpMethod.Get.Method);
            _httpRequest.Url.Returns(_httpsUri);
            _httpRequest.IsSecureConnection.Returns(true);

            Object[] attributes = new[] { new CustomRequireHttpsAttribute() };
            _authorizationContext.ActionDescriptor.ControllerDescriptor.GetCustomAttributes(
                typeof(RequireHttpsAttribute), true).Returns(attributes);
            //Act
            _forceHttpAttribute.OnAuthorization(_authorizationContext);

            //Assert
            _authorizationContext.Result.Should().NotBeOfType<ForbiddenResult>();
        }

        [TestMethod]
        public void OnAuthorization_ShouldNotSetActionResult_WhenActionHasCustomRequireHttpsAttribute()
        {
            //Arrange
            _httpRequest.HttpMethod.Returns(HttpMethod.Get.Method);
            _httpRequest.Url.Returns(_httpsUri);
            _httpRequest.IsSecureConnection.Returns(true);

            Object[] attributes = new[] { new CustomRequireHttpsAttribute() };

            _authorizationContext.ActionDescriptor.GetCustomAttributes(
                typeof(CustomRequireHttpsAttribute), true).Returns(attributes);
            //Act
            _forceHttpAttribute.OnAuthorization(_authorizationContext);

            //Assert
            _authorizationContext.Result.Should().NotBeOfType<ForbiddenResult>();
        }

        [TestMethod]
        public void OnAuthorization_ShouldSetForbiddenActionResult_WhenIsUrlSchemeIsHttps()
        {
            //Arrange
            _httpRequest.HttpMethod.Returns(HttpMethod.Get.Method);
            _httpRequest.Url.Returns(_httpsUri);
            _httpRequest.IsSecureConnection.Returns(true);

            //Act
            _forceHttpAttribute.OnAuthorization(_authorizationContext);

            //Assert
            _authorizationContext.Result.Should().BeOfType<ForbiddenResult>();
        }

        #endregion
    }
}
