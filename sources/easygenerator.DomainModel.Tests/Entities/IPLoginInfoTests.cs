using System;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class IPLoginInfoTests
    {
        #region Ctor

        [TestMethod]
        public void IPLoginInfo_ShouldCreateInstance()
        {
            const string ip = "127.0.0.1";
            const int failedLoginAttemptsCount = 3;
            var lastFailTime = DateTime.Now;

            var loginInfo = IPLoginInfoObjectMother.Create(ip, failedLoginAttemptsCount, lastFailTime);

            loginInfo.Id.Should().NotBeEmpty();
            loginInfo.IP.Should().Be(ip);
            loginInfo.FailedLoginAttemptsCount.Should().Be(failedLoginAttemptsCount);
            loginInfo.LastFailTime.Should().Be(lastFailTime);
        }

        [TestMethod]
        public void IPLoginInfo_ShouldThrowArgumentException_WhenIPIsNullOrEmpty()
        {
            Action action = () => IPLoginInfoObjectMother.Create("");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("ip");
        }

        #endregion

        #region StoreFailedLogin

        [TestMethod]
        public void IPLoginInfo_StoreFailedLogin_ShouldUpdateLastFailedAttemptTime()
        {
            var loginInfo = IPLoginInfoObjectMother.Create();
            DateTimeWrapper.Now = () => DateTime.MaxValue;
            loginInfo.StoreFailedLogin();
            loginInfo.LastFailTime.Value.Should().Be(DateTime.MaxValue);
        }

        [TestMethod]
        public void IPLoginInfo_StoreFailedLogin_ShouldIncrementAttemptsCount_WhenItIsNotMax()
        {
            var loginInfo = IPLoginInfoObjectMother.Create();
            loginInfo.StoreFailedLogin();
            loginInfo.FailedLoginAttemptsCount.Should().Be(1);
        }

        [TestMethod]
        public void IPLoginInfo_StoreFailedLogin_ShouldNotIncrementAttemptsCount_WhenItIsMax()
        {
            var loginInfo = IPLoginInfoObjectMother.Create("127.0.0.1", 1000000);
            loginInfo.StoreFailedLogin();
            loginInfo.FailedLoginAttemptsCount.Should().Be(1000000);
        }

        #endregion

        #region ResetFailedLoginInfo

        [TestMethod]
        public void IPLoginInfo_ResetFailedLoginInfo_ShouldResetLastFailedAttemptTime()
        {
            var loginInfo = IPLoginInfoObjectMother.Create("127.0.0.1", 15, DateTime.MaxValue);
            loginInfo.ResetFailedLoginInfo();
            loginInfo.LastFailTime.HasValue.Should().Be(false);
        }

        [TestMethod]
        public void IPLoginInfo_ResetFailedLoginInfo_ShouldResetCounter()
        {
            var loginInfo = IPLoginInfoObjectMother.Create("127.0.0.1", 15, DateTime.MaxValue);
            loginInfo.ResetFailedLoginInfo();
            loginInfo.FailedLoginAttemptsCount.Should().Be(0);
        }

        #endregion
    }
}
