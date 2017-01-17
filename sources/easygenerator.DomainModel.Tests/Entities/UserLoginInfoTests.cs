using System;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.DomainModel.Tests.ObjectMothers;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class UserLoginInfoTests
    {
        #region Ctor

        [TestMethod]
        public void UserLoginInfo_ShouldCreateInstance()
        {
            const string email = "info@login.com";
            var user = UserObjectMother.CreateWithEmail(email);
            const int failedLoginAttemptsCount = 3;
            var lastFailTime = DateTime.Now;

            var loginInfo = UserLoginInfoObjectMother.Create(user, failedLoginAttemptsCount, lastFailTime);

            loginInfo.Id.Should().NotBeEmpty();
            loginInfo.Email.Should().Be(email);
            loginInfo.FailedLoginAttemptsCount.Should().Be(failedLoginAttemptsCount);
            loginInfo.LastFailTime.Should().Be(lastFailTime);
            loginInfo.User.Should().Be(user);
        }

        #endregion

        #region StoreFailedLogin

        [TestMethod]
        public void UserLoginInfo_StoreFailedLogin_ShouldUpdateLastFailedAttemptTime()
        {
            var loginInfo = UserLoginInfoObjectMother.Create();
            loginInfo.StoreFailedLogin();
            loginInfo.LastFailTime.HasValue.Should().BeTrue();
        }

        [TestMethod]
        public void UserLoginInfo_StoreFailedLogin_ShouldIncrementAttemptsCount_WhenItIsNotMax()
        {
            var loginInfo = UserLoginInfoObjectMother.Create();
            loginInfo.StoreFailedLogin();
            loginInfo.FailedLoginAttemptsCount.Should().Be(1);
        }

        [TestMethod]
        public void UserLoginInfo_StoreFailedLogin_ShouldNotIncrementAttemptsCount_WhenItIsMax()
        {
            var loginInfo = UserLoginInfoObjectMother.Create(UserObjectMother.Create(), 1000000);
            loginInfo.StoreFailedLogin();
            loginInfo.FailedLoginAttemptsCount.Should().Be(1000000);
        }

        #endregion

        #region ResetFailedLoginInfo

        [TestMethod]
        public void UserLoginInfo_ResetFailedLoginInfo_ShouldResetLastFailedAttemptTime()
        {
            var loginInfo = UserLoginInfoObjectMother.Create(UserObjectMother.Create(), 15, DateTime.MaxValue);
            loginInfo.ResetFailedLoginInfo();
            loginInfo.LastFailTime.HasValue.Should().Be(false);
        }

        [TestMethod]
        public void UserLoginInfo_ResetFailedLoginInfo_ShouldResetCounter()
        {
            var loginInfo = UserLoginInfoObjectMother.Create(UserObjectMother.Create(), 15, DateTime.MaxValue);
            loginInfo.ResetFailedLoginInfo();
            loginInfo.FailedLoginAttemptsCount.Should().Be(0);
        }

        #endregion
    }
}
