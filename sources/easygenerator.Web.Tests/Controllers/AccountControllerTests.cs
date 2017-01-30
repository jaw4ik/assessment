using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Tickets;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.DomainModel.Tests.ObjectMothers.Tickets;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Controllers;
using easygenerator.Web.Tests.Utils;
using easygenerator.Web.WooCommerce;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.Web.Security.BruteForceLoginProtection;

namespace easygenerator.Web.Tests.Controllers
{
    [TestClass]
    public class AccountControllerTests
    {
        private const string ip = "127.0.0.1";
        private readonly DateTime CurrentDate = new DateTime(2014, 3, 19);

        private AccountController _controller;

        private IAuthenticationProvider _authenticationProvider;
        private IUserRepository _userRepository;
        private IWooCommerceAutologinUrlProvider _wooCommerceAutologinUrlProvider;
        private IIPInfoProvider _ipInfoProvider;
        private IBruteForceLoginProtectionManager _bruteForceLoginProtectionManager;

       IPrincipal _user;
        HttpContextBase _context;


        [TestInitialize]
        public void InitializeContext()
        {
            _authenticationProvider = Substitute.For<IAuthenticationProvider>();
            _userRepository = Substitute.For<IUserRepository>();
            _wooCommerceAutologinUrlProvider = Substitute.For<IWooCommerceAutologinUrlProvider>();
            _ipInfoProvider = Substitute.For<IIPInfoProvider>();
            _bruteForceLoginProtectionManager = Substitute.For<IBruteForceLoginProtectionManager>();
            _ipInfoProvider.GetIP(Arg.Any<HttpContextBase>()).Returns(ip);

            _controller = new AccountController(_authenticationProvider, _userRepository, _wooCommerceAutologinUrlProvider, _ipInfoProvider, _bruteForceLoginProtectionManager);

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);

            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);

            DateTimeWrapper.Now = () => CurrentDate;
        }

        #region PrivacyPolicy

        [TestMethod]
        public void PrivacyPolicy_ShouldReturnViewResult()
        {
            //Arrange


            //Act
            var result = _controller.PrivacyPolicy();

            //Assert
            ActionResultAssert.IsViewResult(result);
        }

        [TestMethod]
        public void PrivacyPolicy_ShouldSetViewBagClickOnLogoDisabledToTrue()
        {
            //Arrange

            //Act
            _controller.PrivacyPolicy();

            //Assert
            Assert.AreEqual(true, _controller.ViewBag.ClickOnLogoDisabled);
        }

        [TestMethod]
        public void PrivacyPolicy_ShouldSetViewBagNavigationLinksAreDisabledToTrue()
        {
            //Arrange

            //Act
            _controller.PrivacyPolicy();

            //Assert
            Assert.AreEqual(true, _controller.ViewBag.NavigationLinksAreDisabled);
        }

        #endregion

        #region TermsOfUse

        [TestMethod]
        public void TermsOfUse_ShouldReturnViewResult()
        {
            //Arrange


            //Act
            var result = _controller.TermsOfUse();

            //Assert
            ActionResultAssert.IsViewResult(result);
        }

        [TestMethod]
        public void TermsOfUse_ShouldSetViewBagClickOnLogoDisabledToTrue()
        {
            //Arrange

            //Act
            _controller.TermsOfUse();

            //Assert
            Assert.AreEqual(true, _controller.ViewBag.ClickOnLogoDisabled);
        }

        [TestMethod]
        public void TermsOfUse_ShouldSetViewBagNavigationLinksAreDisabledToTrue()
        {
            //Arrange

            //Act
            _controller.TermsOfUse();

            //Assert
            Assert.AreEqual(true, _controller.ViewBag.NavigationLinksAreDisabled);
        }

        #endregion

        #region SignUp

        [TestMethod]
        public void SignUp_ShouldReturnViewResult_WhenCaptchaIsNotRequired()
        {
            //Arrange
            string res = null;
            _bruteForceLoginProtectionManager.GetUrlWithCaptcha(Arg.Any<HttpContextBase>(), ip).Returns(res);

            //Act
            var result = _controller.SignUp();

            //Assert
            ActionResultAssert.IsViewResult(result);
        }

        [TestMethod]
        public void SignUp_ShouldReturnRedirectResult_WhenCaptchaIsRequired()
        {
            //Arrange
            string res = "https://redirect.com";
            _bruteForceLoginProtectionManager.GetUrlWithCaptcha(Arg.Any<HttpContextBase>(), ip).Returns(res);

            //Act
            var result = _controller.SignUp();

            //Assert
            ActionResultAssert.IsRedirectResult(result, res);
        }

        [TestMethod]
        public void SignUp_ShouldSetViewBagClickOnLogoDisabledToTrue_WhenExistingUserIsNotAuthenticated()
        {
            //Arrange
            string res = null;
            _bruteForceLoginProtectionManager.GetUrlWithCaptcha(Arg.Any<HttpContextBase>(), ip).Returns(res);
            _authenticationProvider.IsUserAuthenticated().Returns(false);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(Substitute.For<User>());

            //Act
            _controller.SignUp();

            //Assert
            Assert.AreEqual(true, _controller.ViewBag.ClickOnLogoDisabled);
        }

        #endregion
                
        #region SignIn

        [TestMethod]
        public void SignIn_ShouldReturnViewResult_WhenCaptchaIsNotRequired()
        {
            //Arrange
            string res = null;
            _bruteForceLoginProtectionManager.GetUrlWithCaptcha(Arg.Any<HttpContextBase>(), ip).Returns(res);

            //Act
            var result = _controller.SignIn();

            //Assert
            ActionResultAssert.IsViewResult(result);
        }

        [TestMethod]
        public void SignIn_ShouldReturnRedirectResult_WhenCaptchaIsRequired()
        {
            //Arrange
            string res = "https://redirect.com";
            _bruteForceLoginProtectionManager.GetUrlWithCaptcha(Arg.Any<HttpContextBase>(), ip).Returns(res);

            //Act
            var result = _controller.SignIn();

            //Assert
            ActionResultAssert.IsRedirectResult(result, res);
        }

        #endregion

        #region EmailConfirmation

        [TestMethod]
        public void EmailConfirmation_ShouldReturnHttpNotFoundResult_WhenTicketIsNull()
        {
            //Act
            var result = _controller.EmailConfirmation(null);

            //Assert
            result.Should().BeHttpNotFoundResult();
        }

        [TestMethod]
        public void EmailConfirmation_ShouldConfirmUserEmail()
        {
            //Arrange
            var user = Substitute.For<User>();
            var ticket = EmailConfirmationTicketObjectMother.CreateWithUser(user);

            //Act
            _controller.EmailConfirmation(ticket);

            //Assert
            user.Received().ConfirmEmailUsingTicket(ticket);
        }

        [TestMethod]
        public void EmailConfirmation_ShouldSetNavigationLinksDisabledToTrue()
        {
            //Arrange
            _controller.ViewBag.NavigationLinksAreDisabled = false;
            var user = UserObjectMother.Create();
            var ticket = EmailConfirmationTicketObjectMother.Create();
            user.AddEmailConfirmationTicket(ticket);

            //Act
            _controller.EmailConfirmation(ticket);

            //Assert
            Assert.AreEqual(true, _controller.ViewBag.NavigationLinksAreDisabled);
        }

        [TestMethod]
        public void EmailConfirmation_ShouldReturnEmailConfirmedView()
        {
            //Arrange
            _controller.ViewBag.NavigationLinksAreDisabled = false;
            var user = UserObjectMother.Create();
            var ticket = EmailConfirmationTicketObjectMother.Create();
            user.AddEmailConfirmationTicket(ticket);

            //Act
            var result = _controller.EmailConfirmation(ticket);

            //Assert
            ActionResultAssert.IsViewResult(result, "EmailConfirmed");
        }

        #endregion

        #region PasswordRecovery

        [TestMethod]
        public void PasswordRecovery_ShouldReturnInvalidPasswordRecoveryView_WhenTickenIsNotDefined()
        {
            //Arrange


            //Act
            var result = _controller.PasswordRecovery(null);

            //Assert
            ActionResultAssert.IsViewResult(result, "InvalidPasswordRecovery");
        }


        [TestMethod]
        public void PasswordRecovery_ShouldReturnPasswordRecoveryView_WhenTickenDefined()
        {
            //Arrange
            var ticket = PasswordRecoveryTicketObjectMother.Create();

            //Act
            var result = _controller.PasswordRecovery(ticket);

            //Assert
            ActionResultAssert.IsViewResult(result, "PasswordRecovery");
        }

        [TestMethod]
        public void PasswordRecovery_ShouldReturnInvalidPasswordRecoveryView_WhenTickenIsNotDefinedOnPost()
        {
            //Arrange


            //Act
            var result = _controller.PasswordRecovery(null, "NewPassword");

            //Assert
            ActionResultAssert.IsViewResult(result, "InvalidPasswordRecovery");
        }

        [TestMethod]
        public void PasswordRecovery_ShouldReturnRedirectToDefaultRoute_WhenTickenDefinedOnPost()
        {
            //Arrange
            var ticket = PasswordRecoveryTicketObjectMother.Create();
            var user = UserObjectMother.Create();
            user.AddPasswordRecoveryTicket(ticket);

            //Act
            var result = _controller.PasswordRecovery(ticket, "NewPassword123123");

            //Assert
            ActionResultAssert.IsRedirectToRouteResult(result, "Default");
        }

        [TestMethod]
        public void PasswordRecovery_ShouldRecoverPassword_WhenTickenDefinedOnPost()
        {
            //Arrange
            var ticket = Substitute.For<PasswordRecoveryTicket>();
            var user = Substitute.For<User>();
            ticket.User.Returns(user);

            //Act
            _controller.PasswordRecovery(ticket, "NewPassword123123");

            //Assert
            user.Received().RecoverPasswordUsingTicket(ticket, "NewPassword123123");
        }

        #endregion

        #region Register

        [TestMethod]
        public void Register_ShouldReturnSignUpViewResult()
        {
            //Arrange


            //Act
            var result = _controller.Register();

            //Assert
            ActionResultAssert.IsViewResult(result, "SignUp");
        }

        [TestMethod]
        public void Register_ShouldRedirectToDefaultRoute_WhenExistingUserIsAlreadyAuthenticated()
        {
            //Arrange
            _authenticationProvider.IsUserAuthenticated().Returns(true);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(Substitute.For<User>());

            //Act
            var result = _controller.Register();

            //Assert
            ActionResultAssert.IsRedirectToRouteResult(result, "Default");
        }

        [TestMethod]
        public void Register_ShouldSetViewBagClickOnLogoDisabledToTrue_WhenExistingUserIsNotAuthenticated()
        {
            //Arrange
            _authenticationProvider.IsUserAuthenticated().Returns(false);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(Substitute.For<User>());

            //Act
            _controller.Register();

            //Assert
            Assert.AreEqual(true, _controller.ViewBag.ClickOnLogoDisabled);
        }

        [TestMethod]
        public void Register_ShouldSetViewBagNavigationLinksAreDisabledToTrue_WhenExistingUserIsNotAuthenticated()
        {
            //Arrange
            _authenticationProvider.IsUserAuthenticated().Returns(false);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(Substitute.For<User>());

            //Act
            _controller.Register();

            //Assert
            Assert.AreEqual(true, _controller.ViewBag.NavigationLinksAreDisabled);
        }

        #endregion

        #region UpgradeAccount

        [TestMethod]
        public void UpgradeAccount_ShouldReturnRedirectResult()
        {
            //Arrange
            const string url = "http://xxx.com";
            _wooCommerceAutologinUrlProvider.GetAutologinUrl(Arg.Any<string>()).Returns(url);

            //Act
            var result = _controller.UpgradeAccount();

            //Assert
            result.Should().BeRedirectResult().And.Url.Should().Be(url);
        }

        #endregion
    }
}
