using easygenerator.Web.Publish.Aim4You;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NSubstitute;
using easygenerator.Web.Controllers.Api;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.Infrastructure;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class Aim4YouControllerTests
    {
        private IAim4YouApiService _aim4YouService;
        private IAim4YouCoursePublisher _aim4YouPublisher;
        private Aim4YouController _aim4YouController;
        private IPrincipal _user;
        private HttpContextBase _context;
        private const string userName = "userName";

        [TestInitialize]
        public void InitializeController()
        {
            _aim4YouService = Substitute.For<IAim4YouApiService>();
            _aim4YouPublisher = Substitute.For<IAim4YouCoursePublisher>();

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);

            _aim4YouController = new Aim4YouController(_aim4YouPublisher);
            _aim4YouController.ControllerContext = new ControllerContext(_context, new RouteData(), _aim4YouController);
        }


        #region Publish

        [TestMethod]
        public void Publish_ShouldReturnJsonErrorResult_WhenCourseNotFound()
        {
            //Arrange

            //Act
            var result = _aim4YouController.Publish(null);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.CourseNotFoundError);
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be(Errors.CourseNotFoundResourceKey);
        }

        [TestMethod]
        public void Publish_ShouldReturnJsonErrorResult_WhenPublishFails()
        {
            //Arrange
            _aim4YouPublisher.PublishCourse(Arg.Any<string>(), Arg.Any<Course>(),Arg.Any<string>()).Returns(false);

            //Act
            var result = _aim4YouController.Publish(CourseObjectMother.Create());

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.CoursePublishActionFailedError);
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be(Errors.CoursePublishActionFailedResourceKey);  
        }

        [TestMethod]
        public void Publish_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _aim4YouPublisher.PublishCourse(Arg.Any<string>(), course, Arg.Any<string>()).Returns(true);

            //Act
            var result = _aim4YouController.Publish(course);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.Should().Be(true);
        }

        #endregion
    }
}
