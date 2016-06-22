﻿using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Clonning;
using easygenerator.Infrastructure.DomainModel.Mappings;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Mail;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class CollaborationControllerTests
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";
        private const string UserEmail = "user@easygenerator.com";
        private const string UserEmailWithCapitalsAndSpaces = " uSEr@easyGENErator.com   ";

        private CollaborationController _controller;
        private IUserRepository _userRepository;
        private ICourseCollaboratorRepository _collaborationRepository;
        private IEntityModelMapper<CourseCollaborator> _collaboratorEntityModelMapper;
        private ICollaborationInviteMapper _inviteMapper;
        private IMailSenderWrapper _mailSenderWrapper;
        private ICloner _cloner;

        IPrincipal _user;
        HttpContextBase _context;

        private readonly DateTime CurrentDate = new DateTime(2014, 3, 19);

        [TestInitialize]
        public void InitializeContext()
        {
            _userRepository = Substitute.For<IUserRepository>();
            _collaborationRepository = Substitute.For<ICourseCollaboratorRepository>();

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);
            _collaboratorEntityModelMapper = Substitute.For<IEntityModelMapper<CourseCollaborator>>();
            _inviteMapper = Substitute.For<ICollaborationInviteMapper>();

            _mailSenderWrapper = Substitute.For<IMailSenderWrapper>();
            _cloner = Substitute.For<ICloner>();

            _controller = new CollaborationController(_userRepository, _collaborationRepository, _collaboratorEntityModelMapper, _mailSenderWrapper, _cloner, _inviteMapper);
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
        public void Add_ShouldSendInviteCollaboratorMessage_WnenUserIsNotFound()
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
        public void Add_ShouldTransformEmailToLowerInvariantAndTrimSpaces()
        {
            //Arrange
            _user.Identity.Name.Returns(CreatedBy);

            var course = Substitute.For<Course>();
            var user = UserObjectMother.Create();
            _userRepository.GetUserByEmail(UserEmailWithCapitalsAndSpaces).Returns(user);

            //Act
            _controller.AddCollaborator(course, UserEmailWithCapitalsAndSpaces);

            //Assert
            course.Received().Collaborate(UserEmail, CreatedBy);
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

        #endregion

        #region RemoveCollaborator

        [TestMethod]
        public void RemoveCollaborator_ShouldReturnJsonErrorResult_WnenCourseIsNull()
        {
            //Act
            var result = _controller.RemoveCollaborator(null, null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.CourseNotFoundError);
        }

        [TestMethod]
        public void RemoveCollaborator_ShouldReturnJsonErrorResult_WnenCollaboratorIsNull()
        {
            //Act
            var result = _controller.RemoveCollaborator(CourseObjectMother.Create(), null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.CollaboratorNotFoundError);
        }

        [TestMethod]
        public void RemoveCollaborator_ShouldReturnForbiddenResult_WnenCollaboratorIsAdmin()
        {
            //Arrange
            var course = CourseObjectMother.CreateWithCreatedBy(CreatedBy);
            course.CollaborateAsAdmin(UserEmail);

            //Act
            var result = _controller.RemoveCollaborator(course, UserEmail);

            //Assert
            result.Should().BeForbiddenResult();
        }

        [TestMethod]
        public void RemoveCollaborator_ShouldCallCourseRemoveCollaboratorMethod()
        {
            var course = Substitute.For<Course>();
            var collaboratorEmail = "aa@aa.aa";

            _controller.RemoveCollaborator(course, collaboratorEmail);

            course.Received().RemoveCollaborator(_cloner, collaboratorEmail);
        }

        [TestMethod]
        public void RemoveCollaborator_ShouldReturnJsonSuccess_WhenCollaboratorRemoved()
        {
            var course = CourseObjectMother.Create();
            var collaboratorEmail = "aa@aa.aa";
            course.Collaborate(collaboratorEmail, "createdBy");

            var result = _controller.RemoveCollaborator(course, collaboratorEmail);

            result.Should().BeJsonSuccessResult();
        }
        #endregion

        #region FinishCollaboration

        [TestMethod]
        public void FinishCollaboration_ShouldReturnJsonErrorResult_WnenCourseIsNull()
        {
            //Act
            var result = _controller.FinishCollaboration(null, null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.CourseNotFoundError);
        }

        [TestMethod]
        public void FinishCollaboration_ShouldReturnHttpNotFoundResult_WnenCollaboratorIsNotFound()
        {
            //Arrange
            _user.Identity.Name.Returns(CreatedBy);
            var course = Substitute.For<Course>();
            course.RemoveCollaborator(Arg.Any<ICloner>(), Arg.Any<string>()).ReturnsForAnyArgs(false);

            //Act
            var result = _controller.FinishCollaboration(course, CreatedBy);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.CollaboratorNotFoundError);
        }

        [TestMethod]
        public void FinishCollaboration_ShouldReturnForbiddenResult_WnenCollaboratorIsAdmin()
        {
            //Arrange
            _user.Identity.Name.Returns(CreatedBy);
            var course = CourseObjectMother.Create();
            course.CollaborateAsAdmin(UserEmail);

            //Act
            var result = _controller.FinishCollaboration(course, UserEmail);

            //Assert
            result.Should().BeForbiddenResult();
        }

        [TestMethod]
        public void FinishCollaboration_ShouldReturnForbiddenResult_WnenCollaboratorIsNotCurrentUser()
        {
            //Arrange
            _user.Identity.Name.Returns(CreatedBy);

            //Act
            var result = _controller.FinishCollaboration(CourseObjectMother.Create(), UserEmail);

            //Assert
            result.Should().BeForbiddenResult();
        }

        [TestMethod]
        public void FinishCollaboration_ShouldCallCourseRemoveCollaboratorMethod()
        {
            var course = Substitute.For<Course>();
            var collaboratorEmail = "aa@aa.aa";
            _user.Identity.Name.Returns(collaboratorEmail);

            _controller.FinishCollaboration(course, collaboratorEmail);

            course.Received().RemoveCollaborator(_cloner, collaboratorEmail);
        }

        [TestMethod]
        public void FinishCollaboration_ShouldReturnJsonSuccess_WhenCollaboratorRemoved()
        {
            var course = CourseObjectMother.Create();
            var collaboratorEmail = "aa@aa.aa";
            _user.Identity.Name.Returns(collaboratorEmail);
            course.Collaborate(collaboratorEmail, "createdBy");

            var result = _controller.FinishCollaboration(course, collaboratorEmail);

            result.Should().BeJsonSuccessResult();
        }
        #endregion

        #region DeclineCollaborationInvite

        [TestMethod]
        public void DeclineCollaborationInvite_ShouldReturnJsonErrorResult_WnenCourseIsNull()
        {
            //Act
            var result = _controller.DeclineCollaborationInvite(null, null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.CourseNotFoundError);
        }

        [TestMethod]
        public void DeclineCollaborationInvite_ShouldReturnJsonErrorResult_WnenCollaboratorIsNull()
        {
            //Act
            var result = _controller.DeclineCollaborationInvite(CourseObjectMother.Create(), null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.CollaboratorNotFoundError);
        }

        [TestMethod]
        public void DeclineCollaborationInvite_ShouldReturnForbiddenResult_WnenCollaboratorIsAdmin()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var collaborator = course.CollaborateAsAdmin(UserEmail);

            //Act
            var result = _controller.DeclineCollaborationInvite(course, collaborator);

            //Assert
            result.Should().BeForbiddenResult();
        }

        [TestMethod]
        public void DeclineCollaborationInvite_ShouldCallCourseRemoveCollaboratorMethod()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var collaborator = CourseCollaboratorObjectMother.Create(course, "aa@aa.aa");

            //Act
            _controller.DeclineCollaborationInvite(course, collaborator);

            //Assert
            course.Received().DeclineCollaboration(collaborator);
        }

        [TestMethod]
        public void DeclineCollaborationInvite_ShouldReturnJsonSuccess_WhenCollaboratorRemoved()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            var result = _controller.DeclineCollaborationInvite(course, CourseCollaboratorObjectMother.Create(course, "aa@aa.aa"));

            //Assert
            result.Should().BeJsonSuccessResult();
        }
        #endregion

        #region AcceptCollaborationInvite

        [TestMethod]
        public void AcceptCollaborationInvite_ShouldReturnJsonErrorResult_WnenCourseIsNull()
        {
            //Arrange
            var collaborator = CourseCollaboratorObjectMother.Create();

            //Act
            var result = _controller.AcceptCollaborationInvite(null, collaborator);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.CourseNotFoundError);
        }

        [TestMethod]
        public void AcceptCollaborationInvite_ShouldReturnJsonErrorResult_WnenCollaboratorIsNull()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            var result = _controller.AcceptCollaborationInvite(course, null);

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.CollaboratorNotFoundError);
        }

        [TestMethod]
        public void AcceptCollaborationInvite_ShouldReturnForbiddenResult_WnenCollaboratorIsAdmin()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var collaborator = course.CollaborateAsAdmin(UserEmail);

            //Act
            var result = _controller.AcceptCollaborationInvite(course, collaborator);

            //Assert
            result.Should().BeForbiddenResult();
        }

        [TestMethod]
        public void AcceptCollaborationInvite_ShouldAcceptCollaborationInvite()
        {
            //Arrange
            var collaborator = CourseCollaboratorObjectMother.Create();
            var course = Substitute.For<Course>();

            //Act
            _controller.AcceptCollaborationInvite(course, collaborator);

            //Assert
            course.Received().AcceptCollaboration(collaborator);
        }

        [TestMethod]
        public void AcceptCollaborationInvite_ShouldReturnJsonSuccess()
        {
            //Arrange
            var collaborator = CourseCollaboratorObjectMother.Create();
            var course = Substitute.For<Course>();

            //Act
            var result = _controller.AcceptCollaborationInvite(course, collaborator);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region GetCollaborationInvites

        [TestMethod]
        public void GetCollaborationInvites_ShouldReturnInvites()
        {
            //Arrange
            _user.Identity.Name.Returns(CreatedBy);
            var invites = new List<CollaborationInvite>() { new CollaborationInvite() };
            _collaborationRepository.GetCollaborationInvites(CreatedBy).Returns(invites);

            //Act
            var result = _controller.GetCollaborationInvites();

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion
    }
}
