using System;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
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
    public class BruteForceLoginProtectionManagerTests
    {
        private BruteForceLoginProtectionManager _bruteForceLoginProtectionManager;
        private IUnitOfWork _unitOfWork;
        private IBruteForceLoginProtectionProvider<LoginInfo> _bruteForceLoginProtectionProvider;
        private IUserLoginInfoRepository _userLoginInfoRepository;
        private IIPLoginInfoRepository _ipLoginInfoRepository;
        private ReCaptchaConfigurationSection _reCaptchaConfiguration;
        private ConfigurationReader _configurationReader;

        [TestInitialize]
        public void Initialize()
        {
            _unitOfWork = Substitute.For<IUnitOfWork>();
            _bruteForceLoginProtectionProvider = Substitute.For<IBruteForceLoginProtectionProvider<LoginInfo>>();
            _userLoginInfoRepository = Substitute.For<IUserLoginInfoRepository>();
            _ipLoginInfoRepository = Substitute.For<IIPLoginInfoRepository>();
            _reCaptchaConfiguration = Substitute.For<ReCaptchaConfigurationSection>();
            _configurationReader = Substitute.For<ConfigurationReader>();
            _configurationReader.ReCaptchaConfiguration.Returns(_reCaptchaConfiguration);
            _bruteForceLoginProtectionManager = new BruteForceLoginProtectionManager(_unitOfWork, _bruteForceLoginProtectionProvider, _userLoginInfoRepository, 
                _ipLoginInfoRepository, _configurationReader);
        }

        #region IsRequiredCaptchaForIP

        [TestMethod]
        public void IsRequiredCaptchaForIP_ShouldReturnFalse_WhenReCaptchaIsNotEnabled()
        {
            //Arrange
            _reCaptchaConfiguration.Enabled.Returns(false);

            //Act
            var result = _bruteForceLoginProtectionManager.IsRequiredCaptchaForIP("127.0.0.1");

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void IsRequiredCaptchaForIP_ShouldThrow_WhenReCaptchaIsEnabled_And_IPIsEmpty()
        {
            //Arrange
            _reCaptchaConfiguration.Enabled.Returns(true);
            
            //Act
            Action action = () => _bruteForceLoginProtectionManager.IsRequiredCaptchaForIP("");

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("ip");
        }

        [TestMethod]
        public void IsRequiredCaptchaForIP_ShouldReturnTrue_WhenReCaptchaIsEnabledAndRequired()
        {
            //Arrange
            _reCaptchaConfiguration.Enabled.Returns(true);
            var loginInfo = IPLoginInfoObjectMother.Create();
            _ipLoginInfoRepository.GetByIP("127.0.0.1").Returns(loginInfo);
            _bruteForceLoginProtectionProvider.IsRequiredCaptcha(loginInfo).Returns(true);

            //Act
            var result = _bruteForceLoginProtectionManager.IsRequiredCaptchaForIP("127.0.0.1");

            //Assert
            result.Should().BeTrue();
        }

        #endregion

        #region IsRequiredCaptchaForEmail

        [TestMethod]
        public void IsRequiredCaptchaForEmail_ShouldReturnFalse_WhenReCaptchaIsNotEnabled()
        {
            //Arrange
            _reCaptchaConfiguration.Enabled.Returns(false);

            //Act
            var result = _bruteForceLoginProtectionManager.IsRequiredCaptchaForEmail("r@p.com");

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void IsRequiredCaptchaForEmail_ShouldThrow_WhenReCaptchaIsEnabled_And_EmailIsEmpty()
        {
            //Arrange
            _reCaptchaConfiguration.Enabled.Returns(true);

            //Act
            Action action = () => _bruteForceLoginProtectionManager.IsRequiredCaptchaForEmail("");

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("email");
        }

        [TestMethod]
        public void IsRequiredCaptchaForEmail_ShouldReturnTrue_WhenReCaptchaIsEnabledAndRequired()
        {
            //Arrange
            _reCaptchaConfiguration.Enabled.Returns(true);
            var loginInfo = UserLoginInfoObjectMother.Create();
            _userLoginInfoRepository.GetByEmail("r@p.com").Returns(loginInfo);
            _bruteForceLoginProtectionProvider.IsRequiredCaptcha(loginInfo).Returns(true);

            //Act
            var result = _bruteForceLoginProtectionManager.IsRequiredCaptchaForEmail("r@p.com");

            //Assert
            result.Should().BeTrue();
        }

        #endregion

        #region IsRequiredCaptcha

        [TestMethod]
        public void IsRequiredCaptcha_ShouldReturnFalse_WhenReCaptchaIsNotRequiredForIPAndForEmail()
        {
            //Arrange
            _reCaptchaConfiguration.Enabled.Returns(true);
            var userLoginInfo = UserLoginInfoObjectMother.Create();
            _userLoginInfoRepository.GetByEmail("r@p.com").Returns(userLoginInfo);
            _bruteForceLoginProtectionProvider.IsRequiredCaptcha(userLoginInfo).Returns(false);

            var ipLoginInfo = IPLoginInfoObjectMother.Create();
            _ipLoginInfoRepository.GetByIP("127.0.0.1").Returns(ipLoginInfo);
            _bruteForceLoginProtectionProvider.IsRequiredCaptcha(ipLoginInfo).Returns(false);

            //Act
            var result = _bruteForceLoginProtectionManager.IsRequiredCaptcha("r@p.com", "127.0.0.1");

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void IsRequiredCaptcha_ShouldReturnTrue_WhenReCaptchaIsRequiredForIP()
        {
            //Arrange
            _reCaptchaConfiguration.Enabled.Returns(true);
            var userLoginInfo = UserLoginInfoObjectMother.Create();
            _userLoginInfoRepository.GetByEmail("r@p.com").Returns(userLoginInfo);
            _bruteForceLoginProtectionProvider.IsRequiredCaptcha(userLoginInfo).Returns(false);

            var ipLoginInfo = IPLoginInfoObjectMother.Create();
            _ipLoginInfoRepository.GetByIP("127.0.0.1").Returns(ipLoginInfo);
            _bruteForceLoginProtectionProvider.IsRequiredCaptcha(ipLoginInfo).Returns(true);

            //Act
            var result = _bruteForceLoginProtectionManager.IsRequiredCaptcha("r@p.com", "127.0.0.1");

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void IsRequiredCaptcha_ShouldReturnTrue_WhenReCaptchaIsRequiredForEmail()
        {
            //Arrange
            _reCaptchaConfiguration.Enabled.Returns(true);
            var userLoginInfo = UserLoginInfoObjectMother.Create();
            _userLoginInfoRepository.GetByEmail("r@p.com").Returns(userLoginInfo);
            _bruteForceLoginProtectionProvider.IsRequiredCaptcha(userLoginInfo).Returns(true);

            var ipLoginInfo = IPLoginInfoObjectMother.Create();
            _ipLoginInfoRepository.GetByIP("127.0.0.1").Returns(ipLoginInfo);
            _bruteForceLoginProtectionProvider.IsRequiredCaptcha(ipLoginInfo).Returns(false);

            //Act
            var result = _bruteForceLoginProtectionManager.IsRequiredCaptcha("r@p.com", "127.0.0.1");

            //Assert
            result.Should().BeTrue();
        }

        #endregion

        #region StoreFailedAttempt

        [TestMethod]
        public void StoreFailedAttempt_ShouldThrow_WhenEmailIsNullOrEmpty()
        {
            //Arrange
            _reCaptchaConfiguration.Enabled.Returns(true);

            //Act
            Action action = () => _bruteForceLoginProtectionManager.StoreFailedAttempt("", "127.0.0.1");

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("email");
        }

        [TestMethod]
        public void StoreFailedAttempt_ShouldThrow_WhenIPIsNullOrEmpty()
        {
            //Arrange
            _reCaptchaConfiguration.Enabled.Returns(true);

            //Act
            Action action = () => _bruteForceLoginProtectionManager.StoreFailedAttempt("r@p.com", "");

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("ip");
        }

        [TestMethod]
        public void StoreFailedAttempt_ShouldStoreFailedAttemptsForIPAndEmail()
        {
            //Arrange
            var userLoginInfo = UserLoginInfoObjectMother.Create();
            var ipLoginInfo = IPLoginInfoObjectMother.Create();

            _reCaptchaConfiguration.Enabled.Returns(true);
            _userLoginInfoRepository.GetByEmail("r@p.com").Returns(userLoginInfo);
            _ipLoginInfoRepository.GetByIP("127.0.0.1").Returns(ipLoginInfo);

            //Act
            _bruteForceLoginProtectionManager.StoreFailedAttempt("r@p.com", "127.0.0.1");

            _bruteForceLoginProtectionProvider.Received().StoreFailedAttempt(userLoginInfo);
            _bruteForceLoginProtectionProvider.Received().StoreFailedAttempt(ipLoginInfo);
            _unitOfWork.Received().Save();
        }

        [TestMethod]
        public void StoreFailedAttempt_ShouldCreateIPLoginInfoIfNotExists()
        {
            //Arrange
            var userLoginInfo = UserLoginInfoObjectMother.Create();
            IPLoginInfo ipLoginInfo = null;

            _reCaptchaConfiguration.Enabled.Returns(true);
            _userLoginInfoRepository.GetByEmail("r@p.com").Returns(userLoginInfo);
            _ipLoginInfoRepository.GetByIP("127.0.0.1").Returns(ipLoginInfo);
            
            //Act
            _bruteForceLoginProtectionManager.StoreFailedAttempt("r@p.com", "127.0.0.1");

            _ipLoginInfoRepository.Received().Add(Arg.Any<IPLoginInfo>());
            _bruteForceLoginProtectionProvider.Received().StoreFailedAttempt(userLoginInfo);
            _bruteForceLoginProtectionProvider.Received().StoreFailedAttempt(Arg.Any<IPLoginInfo>());
            _unitOfWork.Received().Save();
        }

        #endregion
    }
}
