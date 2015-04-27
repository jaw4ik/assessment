using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Web;
using System.Web.Mvc;
using HandleErrorAttribute = easygenerator.Web.Components.ActionFilters.HandleErrorAttribute;

namespace easygenerator.Web.Tests.Components.ActionFilters
{
    [TestClass]
    public class HandleErrorAttributeTests
    {
        private HandleErrorAttribute _handlerErrorAttribute;

        private ExceptionContext _filterContext;
        private HttpRequestBase _httpRequest;

        [TestInitialize]
        public void InitializeContext()
        {
            _handlerErrorAttribute = new HandleErrorAttribute();

            _filterContext = Substitute.For<ExceptionContext>();
            _httpRequest = Substitute.For<HttpRequestBase>();

            _filterContext.HttpContext = Substitute.For<HttpContextBase>();
            _filterContext.HttpContext.Request.Returns(_httpRequest);
        }

        #region OnException

        [TestMethod]
        public void OnException_ShouldSetResultWithStatusCode422_WhenExceptionIsArgumentException()
        {
            //Arrange
            _filterContext.Exception.Returns(new ArgumentException());

            //Act
            _handlerErrorAttribute.OnException(_filterContext);

            //Assert
            _filterContext.Result.Should().BeHttpStatusCodeResultWithStatus(422);
        }

        [TestMethod]
        public void OnException_ShouldSetResultWithExceptionMessage_WhenExceptionIsArgumentException()
        {
            //Arrange
            const string message = "message";
            _filterContext.Exception.Returns(new ArgumentException(message));

            //Act
            _handlerErrorAttribute.OnException(_filterContext);

            //Assert
            _filterContext.Result.Should().BeHttpStatusCodeResultWithMessage(message);
        }

        [TestMethod]
        public void OnException_ShouldSetExceptionHandledToTrue_WhenExceptionIsArgumentException()
        {
            //Arrange
            _filterContext.ExceptionHandled = false;
            _filterContext.Exception.Returns(new ArgumentException());

            //Act
            _handlerErrorAttribute.OnException(_filterContext);

            //Assert
            _filterContext.ExceptionHandled.Should().BeTrue();
        }

        [TestMethod]
        public void OnException_ShouldSetExceptionHandledToTrue_WhenNotArgumentExceptionAndAjaxRequest()
        {
            //Arrange
            _httpRequest.SetRequestAjaxHeaders();
            _filterContext.Exception.Returns(new Exception());

            //Act
            _handlerErrorAttribute.OnException(_filterContext);

            //Assert
            _filterContext.ExceptionHandled.Should().BeTrue();
        }

        [TestMethod]
        public void OnException_ShouldSetJsonErrorResult_WhenNotArgumentExceptionAndAjaxRequest()
        {
            //Arrange
            _httpRequest.SetRequestAjaxHeaders();
            _filterContext.Exception.Returns(new Exception());

            //Act
            _handlerErrorAttribute.OnException(_filterContext);

            //Assert
            _filterContext.Result.Should().BeJsonErrorResult();
        }

        [TestMethod]
        public void OnException_ShouldCallBaseOnException_WhenNotArgumentExceptionAndNotAjaxRequest()
        {
            //Arrange
            _filterContext.Exception.Returns(new Exception());

            //Act
            _handlerErrorAttribute.OnException(_filterContext);

            //Assert
            _filterContext.Result.Should().NotBeNull();
        }

        #endregion
    }
}
