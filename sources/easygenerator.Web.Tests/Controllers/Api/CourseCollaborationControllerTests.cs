using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Mappers;
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
        private IDomainEventPublisher<CourseCollaboratorAddedEvent> _courseCollaboratorAddedEventPublisher;
        private IEntityMapper<CourseCollabrator> _collaboratorMapper;
        IPrincipal _user;
        HttpContextBase _context;

        private readonly DateTime CurrentDate = new DateTime(2014, 3, 19);

        [TestInitialize]
        public void InitializeContext()
        {
            _userRepository = Substitute.For<IUserRepository>();

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);
            _collaboratorMapper = Substitute.For<IEntityMapper<CourseCollabrator>>();

            _courseCollaboratorAddedEventPublisher =
                Substitute.For<IDomainEventPublisher<CourseCollaboratorAddedEvent>>();

            _controller = new CourseCollaborationController(_userRepository, _courseCollaboratorAddedEventPublisher, _collaboratorMapper);
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
            course.CollaborateWithUser(Arg.Any<User>(), Arg.Any<string>()).Returns(null as CourseCollabrator);
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
        public void Add_ShouldNotPublishEvent_WhenCollaboratorWasNotAdded()
        {
            //Arrange
            _user.Identity.Name.Returns(CreatedBy);

            var course = Substitute.For<Course>();
            course.CollaborateWithUser(Arg.Any<User>(), Arg.Any<string>()).Returns(null as CourseCollabrator);
            var user = UserObjectMother.Create();
            const string email = "some@email.com";
            _userRepository.GetUserByEmail(email).Returns(user);

            //Act
            _controller.AddCollaborator(course, email);

            //Assert
            _courseCollaboratorAddedEventPublisher.DidNotReceive().Publish(Arg.Any<CourseCollaboratorAddedEvent>());
        }

        [TestMethod]
        public void Add_ShouldReturnJsonSuccessResult_WhenCollaboratorAdded()
        {
            //Arrange
            _user.Identity.Name.Returns(CreatedBy);

            var course = Substitute.For<Course>();
            var user = UserObjectMother.Create();
            var collaborator = CourseCollaboratorObjectMother.Create(course, user, CreatedBy);
            course.CollaborateWithUser(Arg.Any<User>(), Arg.Any<string>()).Returns(collaborator);
            
            const string email = "some@email.com";
            _userRepository.GetUserByEmail(email).Returns(user);

            //Act
            var result = _controller.AddCollaborator(course, email);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void Add_ShouldPublishEvent_WhenCollaboratorAdded()
        {
            //Arrange
            _user.Identity.Name.Returns(CreatedBy);

            var course = Substitute.For<Course>();
            var user = UserObjectMother.Create();
            var collaborator = CourseCollaboratorObjectMother.Create(course, user, CreatedBy);
            course.CollaborateWithUser(Arg.Any<User>(), Arg.Any<string>()).Returns(collaborator);

            const string email = "some@email.com";
            _userRepository.GetUserByEmail(email).Returns(user);

            //Act
            _controller.AddCollaborator(course, email);

            //Assert
            _courseCollaboratorAddedEventPublisher.Received().Publish(Arg.Any<CourseCollaboratorAddedEvent>());
        }

        #endregion
    }
}
