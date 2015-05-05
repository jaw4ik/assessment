using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace easygenerator.Web.Tests.Components.ActionFilters
{
    [TestClass]
    public class ResourceUrlProcessorAttributeTests
    {
        private IActionFilter _resourceUrlProcessor;

        private ActionExecutingContext _filterContext;
        private HttpRequestBase _httpRequest;
        private RouteData _routeData;

        [TestInitialize]
        public void InitializeContext()
        {
            _resourceUrlProcessor = new ResourceUrlProcessorAttribute();

            _filterContext = Substitute.For<ActionExecutingContext>();
            _httpRequest = Substitute.For<HttpRequestBase>();

            _filterContext.HttpContext = Substitute.For<HttpContextBase>();
            _filterContext.HttpContext.Request.Returns(_httpRequest);

            _routeData = new RouteData();
            _filterContext.RouteData = _routeData;
        }

        #region OnActionExecuting

        [TestMethod]
        public void OnActionExecuting_ShouldNotSetFilterResult_WhenResourceUrlIsDefined()
        {
            //Arrange
            _routeData.Values.Add("resourceUrl", "value");

            //Act
            _resourceUrlProcessor.OnActionExecuting(_filterContext);

            //Assert
            _filterContext.Result.Should().BeNull();
        }

        [TestMethod]
        public void OnActionExecuting_ShouldSetEmptyResult_WhenHttpContextIsNull()
        {
            //Arrange
            _filterContext.HttpContext = null;

            //Act
            _resourceUrlProcessor.OnActionExecuting(_filterContext);

            //Assert
            _filterContext.Result.Should().BeEmptyResult();
        }

        [TestMethod]
        public void OnActionExecuting_ShouldNotSetResult_WhenUrlAbsolutePathEndsWithSlash()
        {
            //Arrange
            _httpRequest.Url.Returns(new Uri("http://url.com/resource/"));

            //Act
            _resourceUrlProcessor.OnActionExecuting(_filterContext);

            //Assert
            _filterContext.Result.Should().BeNull();
        }

        [TestMethod]
        public void OnActionExecuting_ShouldSetRedirectResult_WhenUrlAbsolutePathDoesNotEndWithSlash()
        {
            //Arrange
            var uri = new Uri("http://url.com/resource");
            _httpRequest.Url.Returns(uri);

            //Act
            _resourceUrlProcessor.OnActionExecuting(_filterContext);

            //Assert
            _filterContext.Result.Should().BeRedirectResultWithUrl(uri.AbsolutePath + "/");
        }

        #endregion
    }
}
