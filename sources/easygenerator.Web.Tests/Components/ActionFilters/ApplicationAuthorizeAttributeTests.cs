using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Web;
using System.Web.Mvc;

namespace easygenerator.Web.Tests.Components.ActionFilters
{
    [TestClass]
    public class ApplicationAuthorizeAttributeTests
    {
        private IAuthorizationFilter _applicationAuthorizeAttribute;

        private AuthorizationContext _filterContext;
        private HttpRequestBase _httpRequest;
        private HttpResponseBase _httpResponse;

        [TestInitialize]
        public void InitializeContext()
        {
            _applicationAuthorizeAttribute = new ApplicationAuthorize();

            _filterContext = Substitute.For<AuthorizationContext>();
            _httpRequest = Substitute.For<HttpRequestBase>();
            _httpResponse = Substitute.For<HttpResponseBase>();

            _filterContext.HttpContext = Substitute.For<HttpContextBase>();
            _filterContext.HttpContext.Request.Returns(_httpRequest);
            _filterContext.HttpContext.Response.Returns(_httpResponse);
        }

        #region OnAuthorization

        [TestMethod]
        public void OnAuthorization_ShouldSetResponseSuppressFormsAuthenticationRedirectToTrue_WhenUnauthorizedAndAjaxRequest()
        {
            //Arrange
            _httpResponse.SuppressFormsAuthenticationRedirect = false;
            _httpRequest.SetRequestAjaxHeaders();

            //Act
            _applicationAuthorizeAttribute.OnAuthorization(_filterContext);

            //Assert
            _httpResponse.SuppressFormsAuthenticationRedirect.Should().BeTrue();
        }

        [TestMethod]
        public void OnAuthorization_ShouldNotChangeResponseSuppressFormsAuthenticationRedirect_WhenUnauthorized()
        {
            //Arrange
            _httpResponse.SuppressFormsAuthenticationRedirect = false;

            //Act
            _applicationAuthorizeAttribute.OnAuthorization(_filterContext);

            //Assert
            _httpResponse.SuppressFormsAuthenticationRedirect.Should().BeFalse();
        }

        [TestMethod]
        public void OnAuthorization_ShouldCallBaseHandleUnauthorizedRequest_WhenUnauthorized()
        {
            //Arrange
            _filterContext.Result = null;

            //Act
            _applicationAuthorizeAttribute.OnAuthorization(_filterContext);

            //Assert
            _filterContext.Result.Should().NotBeNull();
        }

        #endregion
    }
}
