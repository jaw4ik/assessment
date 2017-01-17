using System;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Security.BruteForceLoginProtection;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Security.BruteForceLoginProtection
{
    [TestClass]
    public class BruteForceLoginProtectionProviderTests
    {
        private BruteForceLoginProtectionProvider<LoginInfo> _bruteForceLoginProtectionProvider;
        private ReCaptchaConfigurationSection _reCaptchaConfiguration;
        private ConfigurationReader _configurationReader;

        [TestInitialize]
        public void Initialize()
        {
            _reCaptchaConfiguration = new ReCaptchaConfigurationSection
            {
                NumberOfFailedAttempts = 10,
                ResetPeriodInHours = 24
            };
            _configurationReader = Substitute.For<ConfigurationReader>();
            _configurationReader.ReCaptchaConfiguration.Returns(_reCaptchaConfiguration);
            _bruteForceLoginProtectionProvider = new BruteForceLoginProtectionProvider<LoginInfo>(_configurationReader);
        }

        #region IsRequiredCaptcha

        [TestMethod]
        public void IsRequiredCaptcha_ShouldReturnFalse_WhenLoginInfoIsNull()
        {
            //Act
            var result = _bruteForceLoginProtectionProvider.IsRequiredCaptcha(null);

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void IsRequiredCaptcha_ShouldReturnFalse_WhenLoginInfoFailedLoginAttemptsCountIsLessThanInConfig()
        {
            //Arrange
            var loginInfo = IPLoginInfoObjectMother.Create();

            //Act
            var result = _bruteForceLoginProtectionProvider.IsRequiredCaptcha(loginInfo);

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void IsRequiredCaptcha_ShouldReturnFalse_WhenDiffBetweenTwoLastFailedAttemptsIsMoreThanInConfig()
        {
            //Arrange
            var loginInfo = IPLoginInfoObjectMother.Create("127.0.0.1", 100, DateTimeWrapper.Now());
            DateTimeWrapper.Now = () => DateTime.Now.AddDays(2);

            //Act
            var result = _bruteForceLoginProtectionProvider.IsRequiredCaptcha(loginInfo);

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void IsRequiredCaptcha_ShouldReturnTrue_WhenDiffBetweenTwoLastFailedAttemptsIsLesserThanInConfig()
        {
            //Arrange
            var loginInfo = IPLoginInfoObjectMother.Create("127.0.0.1", 100, DateTimeWrapper.Now());

            //Act
            var result = _bruteForceLoginProtectionProvider.IsRequiredCaptcha(loginInfo);

            //Assert
            result.Should().BeTrue();
        }

        #endregion

        #region StoreFailedAttempt

        [TestMethod]
        public void StoreFailedAttempt_ShouldStoreFailedLogin()
        {
            var loginInfo = IPLoginInfoObjectMother.Create();
            _bruteForceLoginProtectionProvider.StoreFailedAttempt(loginInfo);
            loginInfo.FailedLoginAttemptsCount.Should().Be(1);
            loginInfo.LastFailTime.HasValue.Should().Be(true);
        }

        [TestMethod]
        public void StoreFailedAttempt_ShouldResetInfoBeforeStoreFailedLogin_WhenDiffBetweenLastTwoFailsIsLargerThanInConfig()
        {
            var loginInfo = IPLoginInfoObjectMother.Create("127.0.0.1", 100, DateTimeWrapper.MinValue());
            DateTimeWrapper.Now = () => DateTime.Now.AddDays(2);

            _bruteForceLoginProtectionProvider.StoreFailedAttempt(loginInfo);
            loginInfo.FailedLoginAttemptsCount.Should().Be(1);
            loginInfo.LastFailTime.HasValue.Should().Be(true);
        }

        #endregion
    }
}
