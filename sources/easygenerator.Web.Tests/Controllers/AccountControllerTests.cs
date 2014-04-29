using System;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
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
        private IDomainEventPublisher<UserUpdateEvent> _userUpdateEventPublisher;

        IPrincipal _user;
        HttpContextBase _context;


        [TestInitialize]
        public void InitializeContext()
        {
            _authenticationProvider = Substitute.For<IAuthenticationProvider>();
            _userRepository = Substitute.For<IUserRepository>();
            _wooCommerceAutologinUrlProvider = Substitute.For<IWooCommerceAutologinUrlProvider>();
            _userUpdateEventPublisher = Substitute.For<IDomainEventPublisher<UserUpdateEvent>>();
            _controller = new AccountController(_authenticationProvider, _userRepository, _wooCommerceAutologinUrlProvider, _userUpdateEventPublisher);

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

        #region SignOut

        [TestMethod]
        public void LogoutAndRedirectToLogin_ShouldRedirectToSignIn()
        {
            //Arrange


            //Act
            var result = _controller.SignOut();

            //Assert
            ActionResultAssert.IsRedirectToRouteResult(result, "SignIn");
        }

        [TestMethod]
        public void LogoutAndRedirectToLogin_ShouldSignOutUser_WhenUserAuthenticated()
        {
            //Arrange
            _authenticationProvider.IsUserAuthenticated().Returns(true);

            //Act
            var result = _controller.SignOut();

            //Assert
            _authenticationProvider.Received().SignOut();
        }

        #endregion

        #region TryWithoutSignup

        [TestMethod]
        public void TryWithoutSignUp_ShouldReturnViewResult()
        {
            //Arrange


            //Act
            var result = _controller.TryWithoutSignup();

            //Assert
            ActionResultAssert.IsViewResult(result);
        }

        [TestMethod]
        public void TryWithoutSignUp_ShouldRedirectToDefaultRoute_WhenUserAlreadyAuthenticated()
        {
            //Arrange
            _authenticationProvider.IsUserAuthenticated().Returns(true);

            //Act
            var result = _controller.TryWithoutSignup();

            //Assert
            ActionResultAssert.IsRedirectToRouteResult(result, "Default");
        }

        [TestMethod]
        public void TryWithoutSignUp_ShouldSignIn_WhenPostAndUserNotAuthenticate()
        {
            //Arrange
            _authenticationProvider.IsUserAuthenticated().Returns(false);

            //Act
            var result = _controller.TryWithoutSignup(null);

            //Assert
            _authenticationProvider.Received().SignIn(Arg.Any<string>(), true);
        }

        [TestMethod]
        public void TryWithoutSignUp_ShouldRedirectToDefaultRoute_WhenPostAction()
        {
            //Arrange
            _authenticationProvider.IsUserAuthenticated().Returns(true);

            //Act
            var result = _controller.TryWithoutSignup(null);

            //Assert
            ActionResultAssert.IsRedirectToRouteResult(result, "Default");
        }

        #endregion

        #region LaunchTryMode

        [TestMethod]
        public void LaunchTryMode_ShouldRedirectToRouteResult()
        {
            //Act
            var result = _controller.LaunchTryMode();

            //Assert
            ActionResultAssert.IsRedirectToRouteResult(result, "Default");
        }

        [TestMethod]
        public void LaunchTryMode_ShouldSignIn_WhenUserNotAuthenticated()
        {
            //Arrange
            _authenticationProvider.IsUserAuthenticated().Returns(false);

            //Act
            var result = _controller.LaunchTryMode();

            //Assert
            _authenticationProvider.Received().SignIn(Arg.Any<String>(), true);
        }

        [TestMethod]
        public void LaunchTryMode_ShouldNotSignIn_WhenUserAuthenticated()
        {
            //Arrange
            _authenticationProvider.IsUserAuthenticated().Returns(true);

            //Act
            var result = _controller.LaunchTryMode();

            //Assert
            _authenticationProvider.DidNotReceive().SignIn(Arg.Any<String>(), true);
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
        public void PasswordRecovery_ShouldSignInUser_WhenTickenDefinedOnPost()
        {
            //Arrange
            var ticket = PasswordRecoveryTicketObjectMother.Create();
            var user = UserObjectMother.Create();
            user.AddPasswordRecoveryTicket(ticket);

            //Act
            _controller.PasswordRecovery(ticket, "NewPassword123123");

            //Assert
            _authenticationProvider.Received().SignIn(ticket.User.Email, true);
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

        [TestMethod]
        public void PasswordRecovery_ShouldRaiseEventAboutUserUpdate()
        {
            //Arrange
            var ticket = Substitute.For<PasswordRecoveryTicket>();
            var user = Substitute.For<User>();
            var password = "NewPassword123123";
            ticket.User.Returns(user);

            //Act
            _controller.PasswordRecovery(ticket, password);

            //Assert
            _userUpdateEventPublisher.Received().Publish
                (
                    Arg.Is<UserUpdateEvent>(_ => _.User == user && _.UserPassword == password)
                );
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
