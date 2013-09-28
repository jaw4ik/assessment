using System;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
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

        [TestInitialize]
        public void InitializeContext()
        {
            _repository = Substitute.For<IUserRepository>();
            _entityFactory = Substitute.For<IEntityFactory>();
            _controller = new UserController(_repository, _entityFactory);
        }

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

            _entityFactory.User(email, password).Returns(user);

            //Act
            _controller.Signup(email, password);

            //Assert
            _repository.Received().Add(user);
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
    }
}
