﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.Web.Controllers;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using easygenerator.Web.Components;
using NSubstitute;

namespace easygenerator.Web.Tests.Controllers
{
    [TestClass]
    public class AccountControllerTests
    {
        private AccountController _controller;
        private IAuthenticationProvider _authenticationProvider; 

        [TestInitialize]
        public void InitializeContext()
        {
            _authenticationProvider = Substitute.For<IAuthenticationProvider>();
            _controller = new AccountController(_authenticationProvider);
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
        public void SignUp_ShouldRedirectToDefaultRoute_WhenUserAlreadyAuthenticated()
        {
            //Arrange
            _authenticationProvider.IsUserAuthenticated().Returns(true);

            //Act
            var result = _controller.SignUp();

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
        public void SignIn_ShouldRedirectToDefaultRoute_WhenUserAlreadyAuthenticated()
        {
            //Arrange
            _authenticationProvider.IsUserAuthenticated().Returns(true);

            //Act
            var result = _controller.SignIn();

            //Assert
            ActionResultAssert.IsRedirectToRouteResult(result, "Default");
        }

        #endregion

        #region SignupFromTry

        [TestMethod]
        public void SignupFromTry_ShouldRedirectToSignUp()
        {
            //Arrange


            //Act
            var result = _controller.SignupFromTry();

            //Assert
            ActionResultAssert.IsRedirectToRouteResult(result, "SignUp");
        }

        [TestMethod]
        public void SignupFromTry_ShouldSignOut_WhenUserAuthenticated()
        {
            //Arrange
            _authenticationProvider.IsUserAuthenticated().Returns(true);

            //Act
            var result = _controller.SignupFromTry();

            //Assert
            _authenticationProvider.Received().SignOut();
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
    }
}
