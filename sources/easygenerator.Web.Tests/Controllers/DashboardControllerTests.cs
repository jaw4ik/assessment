using System.Web.Mvc;
using easygenerator.DataAccess.Migrations;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.Web.Controllers;
using easygenerator.Web.Tests.Utils;
using easygenerator.Web.ViewModels.Dashboard;
using FluentAssertions;
using NSubstitute;

namespace easygenerator.Web.Tests.Controllers
{
    [TestClass]
    public class DashboardControllerTests
    {
        private DashboardController _controller;
        private IUserRepository _userRepository;
        private ICourseRepository _courseRepository;

        private const string UserEmail = "some@mail.com";

        [TestInitialize]
        public void InitializeContext()
        {
            _userRepository = Substitute.For<IUserRepository>();
            _courseRepository = Substitute.For<ICourseRepository>();
            _controller = new DashboardController(_userRepository, _courseRepository);
        }

        #region Index

        [TestMethod]
        public void Index_ShouldReturnView()
        {
            //Act
            var result = _controller.Index();

            //Assert
            ActionResultAssert.IsViewResult(result);
        }

        #endregion

        #region UserSearch

        [TestMethod]
        public void UserSearch_ShouldReturnView()
        {
            //Act
            var result = _controller.UserSearch(null);

            //Assert
            ActionResultAssert.IsViewResult(result);
        }

        [TestMethod]
        public void UserSearch_ShouldSetUserEmailToViewModel_WhenItIsNotNull()
        {
            //Act
            var result = _controller.UserSearch(UserEmail) as ViewResult;

            //Assert
            (result.Model as UserSearchViewModel).Email.Should().Be(UserEmail);
        }

        [TestMethod]
        public void UserSearch_ShouldSetUserToNull_WhenItDoesNotExist()
        {
            //Arrange
            _userRepository.GetUserByEmail(UserEmail).Returns(null as User);

            //Act
            var result = _controller.UserSearch(UserEmail) as ViewResult;

            //Assert

            (result.Model as UserSearchViewModel).User.Should().BeNull();
        }

        [TestMethod]
        public void UserSearch_ShouldSetUser_WhenItExists()
        {
            //Arrange
            _userRepository.GetUserByEmail(UserEmail).Returns(UserObjectMother.Create());

            //Act
            var result = _controller.UserSearch(UserEmail) as ViewResult;

            //Assert
            (result.Model as UserSearchViewModel).User.Should().NotBeNull();
        }

        #endregion

    }
}

