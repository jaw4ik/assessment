using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Mail;
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
        private const string UserEmail = "user@easygenerator.com";

        private CourseCollaborationController _controller;
        private IUserRepository _userRepository;
        private IDomainEventPublisher _eventPublisher;
        private IEntityModelMapper<CourseCollaborator> _collaboratorEntityModelMapper;
        private IMailSenderWrapper _mailSenderWrapper;

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
            _collaboratorEntityModelMapper = Substitute.For<IEntityModelMapper<CourseCollaborator>>();

            _eventPublisher = Substitute.For<IDomainEventPublisher>();
            _mailSenderWrapper = Substitute.For<IMailSenderWrapper>();

            _controller = new CourseCollaborationController(_userRepository, _eventPublisher, _collaboratorEntityModelMapper, _mailSenderWrapper);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
            DateTimeWrapper.Now = () => CurrentDate;
        }

        #region GetCollaborators

        [TestMethod]
        public void GetCollaborators_ShouldReturnJsonErrorResult_WnenCourseIsNull()
        {
            //Act
            var result = _controller.GetCollaborators(null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.CourseNotFoundError);
        }

        [TestMethod]
        public void GetCollaborators_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            var result = _controller.GetCollaborators(course);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

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
        public void Add_ShouldSendInviteCollaboratorMeaasge_WnenUserIsNotFound()
        {
            //Arrange
            _user.Identity.Name.Returns(CreatedBy);

            var course = CourseObjectMother.Create();
            _userRepository.GetUserByEmail(UserEmail).Returns(null as User);
            var author = UserObjectMother.Create();
            _userRepository.GetUserByEmail(CreatedBy).Returns(author);

            //Act
            _controller.AddCollaborator(course, UserEmail);

            //Assert
            _mailSenderWrapper.Received().SendInviteCollaboratorMessage(UserEmail, author.FullName, course.Title);
        }

        [TestMethod]
        public void Add_ShouldAddCollaboratorToCourse()
        {
            //Arrange
            _user.Identity.Name.Returns(CreatedBy);

            var course = Substitute.For<Course>();
            var user = UserObjectMother.Create();
            _userRepository.GetUserByEmail(UserEmail).Returns(user);

            //Act
            _controller.AddCollaborator(course, UserEmail);

            //Assert
            course.Received().Collaborate(UserEmail, CreatedBy);
        }

        [TestMethod]
        public void Add_ShouldReturnJsonSuccessResultWithTrue_WhenCollaboratorWasNotAdded()
        {
            //Arrange
            _user.Identity.Name.Returns(CreatedBy);

            var course = Substitute.For<Course>();
            course.Collaborate(Arg.Any<string>(), Arg.Any<string>()).Returns(null as CourseCollaborator);
            var user = UserObjectMother.Create();
            _userRepository.GetUserByEmail(UserEmail).Returns(user);

            //Act
            var result = _controller.AddCollaborator(course, UserEmail);

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
            course.Collaborate(Arg.Any<string>(), Arg.Any<string>()).Returns(null as CourseCollaborator);
            var user = UserObjectMother.Create();
            _userRepository.GetUserByEmail(UserEmail).Returns(user);

            //Act
            _controller.AddCollaborator(course, UserEmail);

            //Assert
            _eventPublisher.DidNotReceive().Publish(Arg.Any<CourseCollaboratorAddedEvent>());
        }

        [TestMethod]
        public void Add_ShouldReturnJsonSuccessResult_WhenCollaboratorAdded()
        {
            //Arrange
            _user.Identity.Name.Returns(CreatedBy);

            var course = Substitute.For<Course>();
            var user = UserObjectMother.Create();
            var collaborator = CourseCollaboratorObjectMother.Create(course, "user@ww.www");
            course.Collaborate(Arg.Any<string>(), Arg.Any<string>()).Returns(collaborator);

            _userRepository.GetUserByEmail(UserEmail).Returns(user);

            //Act
            var result = _controller.AddCollaborator(course, UserEmail);

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
            var collaborator = CourseCollaboratorObjectMother.Create(course, "user@www.www");
            course.Collaborate(Arg.Any<string>(), Arg.Any<string>()).Returns(collaborator);

            _userRepository.GetUserByEmail(UserEmail).Returns(user);

            //Act
            _controller.AddCollaborator(course, UserEmail);

            //Assert
            _eventPublisher.Received().Publish(Arg.Any<CourseCollaboratorAddedEvent>());
        }

        #endregion
    }
}
