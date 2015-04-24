using System;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using easygenerator.Web.Controllers;
using easygenerator.Web.Tests.Utils;

namespace easygenerator.Web.Tests.Controllers
{
    [TestClass]
    public class ErrorControllerTests
    {
        private ErrorController _controller;
        private HttpContextBase _context;

        [TestInitialize]
        public void InitializeContext()
        {
            _context = Substitute.For<HttpContextBase>();
            _controller = new ErrorController();
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        [TestMethod]
        public void NotFound_ShouldReturnViewResult()
        {
            //Act
            var result = _controller.NotFound();

            //Assert
            ActionResultAssert.IsViewResult(result);
        }

        [TestMethod]
        public void NotFound_ShouldSetResponseStatusCode404()
        {
            //Arrange
            _context.Response.StatusCode = (int)HttpStatusCode.OK;

            //Act
            _controller.NotFound();

            //Assert
            _context.Response.StatusCode.ShouldBeSimilar((int)HttpStatusCode.NotFound);
        }

        [TestMethod]
        public void ServerError_ShouldReturnViewResult()
        {
            //Act
            var result = _controller.ServerError();

            //Assert
            ActionResultAssert.IsViewResult(result);
        }

        [TestMethod]
        public void ServerError_ShouldSetResponseStatusCode500()
        {
            //Arrange
            _context.Response.StatusCode = (int)HttpStatusCode.OK;

            //Act
            _controller.ServerError();

            //Assert
            _context.Response.StatusCode.ShouldBeSimilar((int)HttpStatusCode.InternalServerError);
        }
    }
}
