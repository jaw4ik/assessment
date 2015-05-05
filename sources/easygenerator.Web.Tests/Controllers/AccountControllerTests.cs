using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
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

namespace easygenerator.Web.Tests.Controllers
{
    [TestClass]
    public class AccountControllerTests
    {
        private readonly DateTime CurrentDate = new DateTime(2014, 3, 19);

        private AccountController _controller;

        private IAuthenticationProvider _authenticationProvider;
        private IUserRepository _userRepository;
        private IWooCommerceAutologinUrlProvider _wooCommerceAutologinUrlProvider;

        IPrincipal _user;
        HttpContextBase _context;


        [TestInitialize]
        public void InitializeContext()
        {
            _authenticationProvider = Substitute.For<IAuthenticationProvider>();
            _userRepository = Substitute.For<IUserRepository>();
            _wooCommerceAutologinUrlProvider = Substitute.For<IWooCommerceAutologinUrlProvider>();
            _controller = new AccountController(_authenticationProvider, _userRepository, _wooCommerceAutologinUrlProvider);

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
        public void SignUp_ShouldReturnViewResult()
        {
            //Arrange


            //Act
            var result = _controller.SignUp();

            //Assert
            ActionResultAssert.IsViewResult(result);
        }

        [TestMethod]
        public void SignUp_ShouldRedirectToDefaultRoute_WhenExistingUserIsAlreadyAuthenticated()
        {
            //Arrange
            _authenticationProvider.IsUserAuthenticated().Returns(true);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(Substitute.For<User>());

            //Act
            var result = _controller.SignUp();

            //Assert
            ActionResultAssert.IsRedirectToRouteResult(result, "Default");
        }

        [TestMethod]
        public void SignUp_ShouldSetViewBagClickOnLogoDisabledToTrue_WhenExistingUserIsNotAuthenticated()
        {
            //Arrange
            _authenticationProvider.IsUserAuthenticated().Returns(false);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(Substitute.For<User>());

            //Act
            _controller.SignUp();

            //Assert
            Assert.AreEqual(true, _controller.ViewBag.ClickOnLogoDisabled);
        }

        #endregion

        #region SignUpSecondStep

        [TestMethod]
        public void SignUpSecondStep_ShouldReturnViewResult()
        {
            //Act
            var result = _controller.SignUpSecondStep();

            //Assert
            ActionResultAssert.IsViewResult(result);
        }

        [TestMethod]
        public void SignUpSecondStep_ShouldRedirectToDefaultRoute_WhenExistingUserIsAlreadyAuthenticated()
        {
            //Arrange
            _authenticationProvider.IsUserAuthenticated().Returns(true);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(Substitute.For<User>());

            //Act
            var result = _controller.SignUpSecondStep();

            //Assert
            ActionResultAssert.IsRedirectToRouteResult(result, "Default");
        }

        [TestMethod]
        public void SignUpSecondStep_ShouldSetViewBagClickOnLogoDisabledToTrue_WhenExistingUserIsNotAuthenticated()
        {
            //Arrange
            _authenticationProvider.IsUserAuthenticated().Returns(false);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(Substitute.For<User>());

            //Act
            _controller.SignUpSecondStep();

            //Assert
            Assert.AreEqual(true, _controller.ViewBag.ClickOnLogoDisabled);
        }

        [TestMethod]
        public void SignUpSecondStep_ShouldSetViewBagNavigationLinksAreDisabledToTrue_WhenExistingUserIsNotAuthenticated()
        {
            //Arrange
            _authenticationProvider.IsUserAuthenticated().Returns(false);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(Substitute.For<User>());

            //Act
            _controller.SignUpSecondStep();

            //Assert
            Assert.AreEqual(true, _controller.ViewBag.NavigationLinksAreDisabled);
        }

        #endregion

        #region SignIn

        [TestMethod]
        public void SignIn_ShouldReturnViewResult()
        {
            //Arrange


            //Act
            var result = _controller.SignIn();

            //Assert
            ActionResultAssert.IsViewResult(result);
        }

        [TestMethod]
        public void SignIn_ShouldRedirectToDefaultRoute_WhenExistingUserIsAlreadyAuthenticated()
        {
            //Arrange
            _authenticationProvider.IsUserAuthenticated().Returns(true);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(Substitute.For<User>());

            //Act
            var result = _controller.SignIn();

            //Assert
            ActionResultAssert.IsRedirectToRouteResult(result, "Default");
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
