using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class CourseCollaborationControllerTests
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";

        private CourseCollaborationController _controller;
        private IUserRepository _userRepository;

        IEntityFactory _entityFactory;
        IPrincipal _user;
        HttpContextBase _context;

        private readonly DateTime CurrentDate = new DateTime(2014, 3, 19);

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _userRepository = Substitute.For<IUserRepository>();

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);

            _controller = new CourseCollaborationController(_entityFactory, _userRepository);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
            DateTimeWrapper.Now = () => CurrentDate;
        }

        #region Add

        [TestMethod]
        public void Add_ShouldReturnJsonErrorResult_WnenCourseIsNull()
        {
            //Act
            var result = _controller.AddCollaborator(null, null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.CourseNotFoundError);
        }

        [TestMethod]
        public void Add_ShouldReturnJsonErrorResult_WnenUserIsNotFound()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            const string email = "some@email.com";
            _userRepository.GetUserByEmail(email).Returns(null as User);

            //Act
            var result = _controller.AddCollaborator(course, email);

            //Assert
            result.Should().BeJsonErrorResultWithMessage(Errors.UserWithSpecifiedEmailDoesntExist);
        }

        [TestMethod]
        public void Add_ShouldAddCollaboratorToCourse()
        {
            //Arrange
            _user.Identity.Name.Returns(CreatedBy);

            var course = Substitute.For<Course>();
            var user = UserObjectMother.Create();
            const string email = "some@email.com";
            _userRepository.GetUserByEmail(email).Returns(user);
            var collaborator = CourseCollaboratorObjectMother.Create();

            //Act
            _controller.AddCollaborator(course, email);

            //Assert
            course.Received().CollaborateWithUser(user, CreatedBy);
        }

        [TestMethod]
        public void Add_ShouldReturnJsonSuccessResultWithTrue_WhenCollaboratorWasNotAdded()
        {
            //Arrange
            _user.Identity.Name.Returns(CreatedBy);

            var course = Substitute.For<Course>();
            course.CollaborateWithUser(Arg.Any<User>(), Arg.Any<string>()).Returns(false);
            var user = UserObjectMother.Create();
            const string email = "some@email.com";
            _userRepository.GetUserByEmail(email).Returns(user);

            //Act
            var result = _controller.AddCollaborator(course, email);

            //Assert
            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(true);
        }

        [TestMethod]
        public void Add_ShouldReturnJsonSuccessResult_WhenCollaboratorNotAdded()
        {
            //Arrange
            _user.Identity.Name.Returns(CreatedBy);

            var course = Substitute.For<Course>();
            course.CollaborateWithUser(Arg.Any<User>(), Arg.Any<string>()).Returns(true);
            var user = UserObjectMother.Create();
            const string email = "some@email.com";
            _userRepository.GetUserByEmail(email).Returns(user);

            //Act
            var result = _controller.AddCollaborator(course, email);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion
    }
}
