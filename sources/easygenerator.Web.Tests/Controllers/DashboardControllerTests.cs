using easygenerator.DataAccess.Migrations;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.Web.Controllers;
using easygenerator.Web.Tests.Utils;
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

        #region GetUserInfo

        [TestMethod]
        public void GetUserInfo_ShouldReturnView()
        {
            //Act
            var result = _controller.UserInfo();

            //Assert
            ActionResultAssert.IsViewResult(result);
        }

        #endregion


        #region PostUserInfo

        [TestMethod]
        public void PostUserInfo_ShouldReturn_UserNotFoundView_WhenUserEmailIsNull()
        {
            //Act
            var result = _controller.UserInfo(null);

            //Assert
            ActionResultAssert.IsPartialViewResult(result, "_UserNotFoundResult");
        }

        [TestMethod]
        public void PostUserInfo_ShouldReturn_UserNotFoundView_WhenUserIsNotFound()
        {
            //Arrange
            _userRepository.GetUserByEmail(UserEmail).Returns(null as User);

            //Act
            var result = _controller.UserInfo(UserEmail);

            //Assert
            ActionResultAssert.IsPartialViewResult(result, "_UserNotFoundResult");
        }

        [TestMethod]
        public void PostUserInfo_ShouldReturn_UserInfoResultViewd()
        {
            //Arrange
            _userRepository.GetUserByEmail(UserEmail).Returns(UserObjectMother.Create());

            //Act
            var result = _controller.UserInfo(UserEmail);

            //Assert
            ActionResultAssert.IsPartialViewResult(result, "_UserInfoResult");
        }

        #endregion
    }
}

