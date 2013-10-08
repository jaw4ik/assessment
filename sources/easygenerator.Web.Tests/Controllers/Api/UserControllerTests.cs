﻿using System;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Components;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class UserControllerTests
    {
        private IUserRepository _repository;
        private UserController _controller;
        private IEntityFactory _entityFactory;
        private IAuthenticationProvider _authenticationProvider;
        IPrincipal _user;
        HttpContextBase _context;

        [TestInitialize]
        public void InitializeContext()
        {
            _repository = Substitute.For<IUserRepository>();
            _entityFactory = Substitute.For<IEntityFactory>();
            _authenticationProvider = Substitute.For<IAuthenticationProvider>();
            _controller = new UserController(_repository, _entityFactory, _authenticationProvider);

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);

            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region Signin

        [TestMethod]
        public void Signin_ShouldReturnJsonErrorResult_WhenUserDoesNotExist()
        {
            var result = _controller.Signin(null, null);

            result.Should().BeJsonErrorResult();
        }

        [TestMethod]
        public void Signin_ShouldReturnJsonErrorResult_WhenPasswordIsWrong()
        {
            const string username = "username@easygenerator.com";
            const string password = "Abc123!";

            var user = Substitute.For<User>();
            _repository.GetUserByEmail(username).Returns(user);
            user.VerifyPassword(password).Returns(false);

            var result = _controller.Signin(username, password);

            result.Should().BeJsonErrorResult();
        }

        [TestMethod]
        public void Signin_ShouldAuthenticateUser()
        {
            const string username = "username@easygenerator.com";
            const string password = "Abc123!";

            var user = Substitute.For<User>();
            _repository.GetUserByEmail(username).Returns(user);
            user.VerifyPassword(password).Returns(true);

            _controller.Signin(username, password);

            _authenticationProvider.Received().SignIn(username, true);
        }

        [TestMethod]
        public void Signin_ShouldReturnJsonSuccessResult()
        {
            const string username = "username@easygenerator.com";
            const string password = "Abc123!";

            var user = Substitute.For<User>();
            user.VerifyPassword(password).Returns(true);
            _repository.GetUserByEmail(username).Returns(user);

            var result = _controller.Signin(username, password);

            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region Signup

        [TestMethod]
        public void Signup_ShouldReturnJsonErrorResult_WhenUserWithSuchEmailExists()
        {
            //Arrange
            var email = "easygenerator@easygenerator.com";
            _repository.GetUserByEmail(email).Returns(UserObjectMother.CreateWithEmail(email));

            //Act
            var result = _controller.Signup(email, "Some password");

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be("Account with this email already exists");
        }

        [TestMethod]
        public void Signup_ShouldAddUserToRepository()
        {
            //Arrange
            var email = "easygenerator@easygenerator.com";
            var password = "Easy123!";
            var user = UserObjectMother.Create(email, password);

            _entityFactory.User(email, password, email).Returns(user);

            //Act
            _controller.Signup(email, password);

            //Assert
            _repository.Received().Add(user);
        }

        [TestMethod]
        public void Signup_ShouldSignInNewUser()
        {
            //Arrange
            var email = "easygenerator@easygenerator.com";
            var password = "Easy123!";

            //Act
            _controller.Signup(email, password);

            //Assert
            _authenticationProvider.Received().SignIn(email, true);
        }

        [TestMethod]
        public void Signup_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var email = "easygenerator@easygenerator.com";
            var password = "Easy123!";

            //Act
            var result = _controller.Signup(email, password);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region Exists

        [TestMethod]
        public void Exists_ShouldReturnJsonTrueResult_WhenUserWithSuchEmailExists()
        {
            //Arrange
            var email = "easygenerator@easygenerator.com";
            _repository.GetUserByEmail(email).Returns(UserObjectMother.CreateWithEmail(email));

            //Act
            var result = _controller.Exists(email);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.Should().Be(true);
        }

        [TestMethod]
        public void Exists_ShouldReturnJsonFalseResult_WhenUserWithSuchEmailNotExists()
        {
            //Arrange
            var email = "easygenerator@easygenerator.com";

            //Act
            var result = _controller.Exists(email);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.Should().Be(false);
        }

        #endregion
    }
}
