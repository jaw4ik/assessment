using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Tests.Utils;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class CommentControllerTests
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";

        private CommentController _controller;

        IEntityFactory _entityFactory;
        IPrincipal _user;
        HttpContextBase _context;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _controller = new CommentController(_entityFactory);

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);

            _controller = new CommentController(_entityFactory);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region Create comment

        [TestMethod]
        public void Create_ShouldReturnJsonErrorResult_WnenCourseIsNull()
        {
            //Act
            var result = _controller.Create(null, null, null, null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.CourseNotFoundError);
        }

        [TestMethod]
        public void Create_ShouldAddCommentToCourse()
        {
            //Arrange
            const string text = "text";
            const string user = "Test user";
            const string email = "test@test.test";
            _user.Identity.Name.Returns("Test user");
            var course = Substitute.For<Course>("Course", TemplateObjectMother.Create(), CreatedBy);
            var comment = Substitute.For<Comment>("Comment", user, email);

            _entityFactory.Comment(text, user, email).Returns(comment);

            //Act
            _controller.Create(course, text, user, email);

            //Assert
            course.Received().AddComment(comment);
        }

        [TestMethod]
        public void Create_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            const string text = "text";
            const string user = "Test user";
            const string email = "test@test.test";
            _user.Identity.Name.Returns("Test user");
            var course = Substitute.For<Course>("Course", TemplateObjectMother.Create(), CreatedBy);
            var comment = Substitute.For<Comment>("Comment", user, email);

            _entityFactory.Comment(text, user, email).Returns(comment);

            //Act
            var result = _controller.Create(course, text, user, email);

            //Assert
            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(true);
        }

        #endregion

        #region GetComments

        [TestMethod]
        public void GetComments_ShouldReturnHttpNotFound_WhenCourseIsNull()
        {
            //Act
            var result = _controller.GetComments(null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.CourseNotFoundError);
        }

        [TestMethod]
        public void GetComments_ShouldReturnJsonSuccessResult_WhenCourseNotNull()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            var result = _controller.GetComments(course);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region Delete comment

        [TestMethod]
        public void Delete_ShouldReturnJsonErrorResult_WnenCourseIsNull()
        {
            //Act
            var result = _controller.Delete(null, null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.CourseNotFoundError);
        }

        [TestMethod]
        public void Delete_ShouldReturnJsonSuccessResult_WnenCommentIsNull()
        {
            //Arrange
            var course = Substitute.For<Course>("Course", TemplateObjectMother.Create(), CreatedBy);

            //Act
            var result = _controller.Delete(course, null);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void Delete_ShouldDeleteCommentFromCourse()
        {
            //Arrange
            var course = Substitute.For<Course>("Course", TemplateObjectMother.Create(), CreatedBy);
            var comment = Substitute.For<Comment>();

            //Act
            _controller.Delete(course, comment);

            //Assert
            course.Received().DeleteComment(comment);
        }

        [TestMethod]
        public void Delete_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var course = Substitute.For<Course>("Course", TemplateObjectMother.Create(), CreatedBy);
            var comment = Substitute.For<Comment>();

            //Act
            var result = _controller.Delete(course, comment);

            //Assert
            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(true);
        }

        #endregion
    }
}
