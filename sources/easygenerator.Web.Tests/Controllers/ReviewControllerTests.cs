using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Controllers;
using easygenerator.Web.Publish;
using easygenerator.Web.Tests.Utils;

namespace easygenerator.Web.Tests
{
    [TestClass]
    public class ReviewControllerTests
    {
        private ReviewController _controller;
        private HttpContextBase _context;
        private HttpRequestBase _request;
        private Uri _requestUri;
        private const string urlScheme="http";
        private const string urlAuthority = "app.easygenerator.com";
        private HttpServerUtilityBase _server;

        [TestInitialize]
        public void InitializeController()
        {
            _context = Substitute.For<HttpContextBase>();
            _request = Substitute.For<HttpRequestBase>();
            _requestUri = new Uri("http://app.easygenerator.com");

            _server = Substitute.For<HttpServerUtilityBase>();
            _context.Server.ReturnsForAnyArgs(_server);

            _context.Request.ReturnsForAnyArgs(_request);
            _request.Url.ReturnsForAnyArgs(_requestUri);

            _controller = new ReviewController();
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region ReviewCourse

        [TestMethod]
        public void ReviewCourse_ShouldReturnHttpNotFoundCodeResult_WhenCourseIsNull()
        {
            //Act
            var result = _controller.ReviewCourse(null);

            //Assert
            ActionResultAssert.IsHttpNotFoundActionResult(result);
        }

        [TestMethod]
        public void ReviewCourse_ShouldReturnHttpNotFoundCodeResult_WhenCourseIsNotPublished()
        {
            //Act
            var result = _controller.ReviewCourse(CourseObjectMother.Create());

            //Assert
            ActionResultAssert.IsHttpNotFoundActionResult(result);
        }

        [TestMethod]
        public void ReviewCourse_ShouldReturnView()
        {
            //arrange
            var course = CourseObjectMother.Create();
            course.UpdatePublicationUrl("url");

            //Act
            var result = _controller.ReviewCourse(course);

            //Assert
            ActionResultAssert.IsViewResult(result);
        }

        [TestMethod]
        public void ReviewCourse_ShouldSetViewBagPublishedCourseUrl()
        {
            //arrange
            const string publishedPackageUrl = "url";
            var course = CourseObjectMother.Create();
            course.UpdatePublicationUrl(publishedPackageUrl);
            var reviewApiUrl = $"{urlScheme}://{urlAuthority}";
            var encodedUrl = "encUrl";
            _server.UrlEncode(reviewApiUrl).Returns(encodedUrl);

            //Act
            _controller.ReviewCourse(course);

            //Assert
            Assert.AreEqual(_controller.ViewBag.PublishedCourseUrl, $"{publishedPackageUrl}?reviewApiUrl={encodedUrl}");
        }

        [TestMethod]
        public void ReviewCourse_ShouldSetViewBagCourseId()
        {
            //arrange
            var course = CourseObjectMother.Create();
            course.UpdatePublicationUrl("url");

            //Act
            _controller.ReviewCourse(course);

            //Assert
            Assert.AreEqual(_controller.ViewBag.CourseId, course.Id.ToString());
        }

        #endregion
    }
}
