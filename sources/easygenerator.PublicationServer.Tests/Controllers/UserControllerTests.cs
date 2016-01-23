using System;
using System.Net;
using System.Net.Http;
using easygenerator.PublicationServer.Controllers;
using easygenerator.PublicationServer.DataAccess;
using easygenerator.PublicationServer.Models;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.PublicationServer.Tests.Controllers
{
    [TestClass]
    public class UserControllerTests
    {
        private UserController _controller;
        private IUserRepository _repository;
        private string email = "email";
        private AccessType acceeType = AccessType.Free;

        [TestInitialize]
        public void Init()
        {
            DateTimeWrapper.Now = () => DateTime.MinValue;
            _repository = Substitute.For<IUserRepository>();
            _controller = new UserController(_repository);
            _controller.Request = new HttpRequestMessage();
        }

        [TestMethod]
        public void Create_ShouldCreateUserIfNotExist()
        {
            _repository.Get(email).Returns((User)null);
            _controller.Create(email, acceeType);
            _repository.Received().Add(Arg.Is<User>(_ => _.Email == email && _.AccessType == acceeType && _.ModifiedOn == DateTimeWrapper.Now()));
        }

        [TestMethod]
        public void Create_ShouldNotCreateUserIfExists()
        {
            var user = new User(email, acceeType);
            _repository.Get(email).Returns(user);
            _controller.Create(email, acceeType);
            _repository.DidNotReceive().Add(Arg.Any<User>());
        }

        [TestMethod]
        public void Create_ShouldReturnMessageWithOKStatus()
        {
            var result = _controller.Create(email, acceeType);
            result.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [TestMethod]
        public void Update_ShouldUpdateUser()
        {
            _controller.Update(email, acceeType);
            _repository.Received().Update(Arg.Is<User>(_ => _.Email == email && _.AccessType == acceeType && _.ModifiedOn == DateTimeWrapper.Now()));
        }

        [TestMethod]
        public void Update_ShouldReturnMessageWithOKStatus()
        {
            var result = _controller.Update(email, acceeType);
            result.StatusCode.Should().Be(HttpStatusCode.OK);
        }
    }
}
