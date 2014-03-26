using easygenerator.Infrastructure;
using easygenerator.Web.Publish;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.Web.Controllers;
using NSubstitute;
using System.Web.Mvc;
using System.Net;
using System.Web;
using System.Web.Routing;

namespace easygenerator.Web.Tests.Controllers
{
    [TestClass]
    public class PublishedPackageControllerTest
    {
        private ICoursePublishingService _coursePublishingService;
        private PhysicalFileManager _physicalFileManager;
        private PublishedPackageController _controller;
        private HttpContextBase _context;

        [TestInitialize]
        public void InitializeController()
        {
            _coursePublishingService = Substitute.For<ICoursePublishingService>();
            _context = Substitute.For<HttpContextBase>();
            _physicalFileManager = Substitute.For<PhysicalFileManager>();

            _controller = new PublishedPackageController(_coursePublishingService, _physicalFileManager);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        [TestMethod]
        public void GetPublishedResource_ShouldReturnHttpNotFoundCodeResult_IfResourceDoesNotExist()
        {
            //Arrange
            _physicalFileManager.FileExists(Arg.Any<string>()).Returns(false);

            //Act
            var result = _controller.GetPublishedResource("packageId", "resourceId");

            //Assert
            _context.Response.StatusCode.ShouldBeSimilar((int)HttpStatusCode.NotFound);
        }

        [TestMethod]
        public void GetPublishedResource_ShouldReturnFilePathResult_IfResourceExists()
        {
            //Arrange
            _physicalFileManager.FileExists(Arg.Any<string>()).Returns(true);
            _coursePublishingService.GetPublishedResourcePhysicalPath(Arg.Any<string>()).Returns("filePath");
            //Act
            var result = _controller.GetPublishedResource("packageId", "resourceId");

            //Assert
            result.Should().BeOfType<FilePathResult>();
        }
    }
}
