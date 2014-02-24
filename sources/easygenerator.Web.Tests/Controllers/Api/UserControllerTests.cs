using System;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Handlers;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Mail;
using easygenerator.Web.Tests.Utils;
using easygenerator.Web.ViewModels.Account;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class UserControllerTests
    {
        private IUserRepository _userRepository;
        private IHelpHintRepository _helpHintRepository;
        private UserController _controller;
        private IEntityFactory _entityFactory;
        private IAuthenticationProvider _authenticationProvider;
        private ISignupFromTryItNowHandler _signupFromTryItNowHandler;
        private IDomainEventPublisher<UserSignedUpEvent> _publisher;
        private IMailSenderWrapper _mailSenderWrapper;

        IPrincipal _user;
        HttpContextBase _context;

        [TestInitialize]
        public void InitializeContext()
        {
            _userRepository = Substitute.For<IUserRepository>();
            _helpHintRepository = Substitute.For<IHelpHintRepository>();
            _entityFactory = Substitute.For<IEntityFactory>();
            _authenticationProvider = Substitute.For<IAuthenticationProvider>();
            _signupFromTryItNowHandler = Substitute.For<ISignupFromTryItNowHandler>();
            _publisher = Substitute.For<IDomainEventPublisher<UserSignedUpEvent>>();
            _mailSenderWrapper = Substitute.For<IMailSenderWrapper>();

            _controller = new UserController(_userRepository, _helpHintRepository, _entityFactory, _authenticationProvider, _signupFromTryItNowHandler, _publisher, _mailSenderWrapper);

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);

            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region Signin

        [TestMethod]
        public void Signin_ShouldReturnJsonErrorResult_WhenUserDoesNotExist()
        {
            var result = _controller.Signin(null, null);

            result.Should().BeJsonErrorResult();
        }

        [TestMethod]
        public void Signin_ShouldReturnJsonErrorResult_WhenPasswordIsWrong()
        {
            const string username = "username@easygenerator.com";
            const string password = "Abc123!";

            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(username).Returns(user);
            user.VerifyPassword(password).Returns(false);

            var result = _controller.Signin(username, password);

            result.Should().BeJsonErrorResult();
        }

        [TestMethod]
        public void Signin_ShouldAuthenticateUser()
        {
            const string username = "username@easygenerator.com";
            const string password = "Abc123!";

            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(username).Returns(user);
            user.VerifyPassword(password).Returns(true);

            _controller.Signin(username, password);

            _authenticationProvider.Received().SignIn(username, true);
        }

        [TestMethod]
        public void Signin_ShouldReturnJsonSuccessResult()
        {
            const string username = "username@easygenerator.com";
            const string password = "Abc123!";

            var user = Substitute.For<User>();
            user.VerifyPassword(password).Returns(true);
            _userRepository.GetUserByEmail(username).Returns(user);

            var result = _controller.Signin(username, password);

            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region Signup

        [TestMethod]
        public void Signup_ShouldReturnJsonErrorResult_WhenUserWithSuchEmailExists()
        {
            //Arrange
            var profile = GetTestUserSignUpViewModel();
            _userRepository.GetUserByEmail(profile.Email).Returns(UserObjectMother.CreateWithEmail(profile.Email));

            //Act
            var result = _controller.Signup(profile);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be("Account with this email already exists");
        }

        [TestMethod]
        public void Signup_ShouldAddUserToRepository()
        {
            //Arrange
            var profile = GetTestUserSignUpViewModel();
            var user = UserObjectMother.Create(profile.Email, profile.Password);
            _entityFactory.User(profile.Email, profile.Password, profile.FirstName, profile.LastName, profile.Phone, profile.Organization, profile.Country, profile.Email, Arg.Any<UserSettings>()).Returns(user);
            
            //Act
            _controller.Signup(profile);

            //Assert
            _userRepository.Received().Add(user);
        }

        [TestMethod]
        public void Signup_ShouldRaiseEventAboutUserCreation()
        {
            //Arrange
            var profile = GetTestUserSignUpViewModel();
            var user = UserObjectMother.Create(profile.Email, profile.Password);
            _entityFactory.User(profile.Email, profile.Password, profile.FirstName, profile.LastName, profile.Phone, profile.Organization, profile.Country, profile.Email, Arg.Any<UserSettings>()).Returns(user);

            //Act
            _controller.Signup(profile);

            //Assert
            _publisher.Received().Publish
                (
                    Arg.Is<UserSignedUpEvent>(_ => _.User == user && _.UsedAuthoringTool == profile.UsedAuthoringTool && _.CourseDevelopersCount == profile.PeopleBusyWithCourseDevelopmentAmount
                    && _.WhenNeedAuthoringTool == profile.NeedAuthoringTool)
                );
        }

        [TestMethod]
        public void Signup_ShouldHandleTryItNowModeContent_WhenUserWasInTryItNowMode()
        {
            //Arrange
            const string tryItNowUsername = "username";
            var profile = GetTestUserSignUpViewModel();
            var user = UserObjectMother.Create(profile.Email, profile.Password);

            _user.Identity.IsAuthenticated.Returns(true);
            _user.Identity.Name.Returns(tryItNowUsername);
            _userRepository.GetUserByEmail(tryItNowUsername).Returns((User)null);
            _entityFactory.User(profile.Email, profile.Password, profile.FirstName, profile.LastName, profile.Phone, profile.Organization, profile.Country, profile.Email, Arg.Any<UserSettings>()).Returns(user);

            //Act
            _controller.Signup(profile);

            //Assert
            _signupFromTryItNowHandler.Received().HandleOwnership(tryItNowUsername, profile.Email);
        }

        [TestMethod]
        public void Signup_ShouldSignInNewUser()
        {
            //Arrange
            var profile = GetTestUserSignUpViewModel();
            var user = UserObjectMother.Create(profile.Email, profile.Password);
            _entityFactory.User(profile.Email, profile.Password, profile.FirstName, profile.LastName, profile.Phone, profile.Organization, profile.Country, profile.Email, Arg.Any<UserSettings>()).Returns(user);

            //Act
            _controller.Signup(profile);

            //Assert
            _authenticationProvider.Received().SignIn(profile.Email, true);
        }

        [TestMethod]
        public void Signup_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var profile = GetTestUserSignUpViewModel();
            var user = UserObjectMother.Create(profile.Email, profile.Password);
            _entityFactory.User(profile.Email, profile.Password, profile.FirstName, profile.LastName, profile.Phone, profile.Organization, profile.Country, profile.Email, Arg.Any<UserSettings>()).Returns(user);

            //Act
            var result = _controller.Signup(profile);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.Should().Be(profile.Email);
        }

        [TestMethod]
        public void SignUp_ShouldNotCreateHelpHintsForUser_WhenUserSignupFromTry()
        {
            //Arrange
            var profile = GetTestUserSignUpViewModel();
            var user = UserObjectMother.Create(profile.Email, profile.Password);
            _entityFactory.User(profile.Email, profile.Password, profile.FirstName, profile.LastName, profile.Phone, profile.Organization, profile.Country, profile.Email, Arg.Any<UserSettings>()).Returns(user);
            _user.Identity.IsAuthenticated.Returns(true);

            //Act
            _controller.Signup(profile);

            //Assert
            _helpHintRepository.DidNotReceive().CreateHelpHintsForUser(profile.Email);
        }

        [TestMethod]
        public void SignUp_ShouldNotCreateHelpHintsForUser_WhenUserSignup()
        {
            //Arrange
            var profile = GetTestUserSignUpViewModel();
            var user = UserObjectMother.Create(profile.Email, profile.Password);
            _entityFactory.User(profile.Email, profile.Password, profile.FirstName, profile.LastName, profile.Phone, profile.Organization, profile.Country, profile.Email, Arg.Any<UserSettings>()).Returns(user);
            _user.Identity.IsAuthenticated.Returns(false);

            //Act
            _controller.Signup(profile);

            //Assert
            _helpHintRepository.Received().CreateHelpHintsForUser(profile.Email);
        }

        [TestMethod]
        public void Signup_ShouldBeClearSession()
        {
            //Arrange
            var profile = GetTestUserSignUpViewModel();
            var user = UserObjectMother.Create(profile.Email, profile.Password);
            _entityFactory.User(profile.Email, profile.Password, profile.FirstName, profile.LastName, profile.Phone, profile.Organization, profile.Country, profile.Email, Arg.Any<UserSettings>()).Returns(user);
            //Act
            _controller.Signup(profile);

            //Assert
            _context.Session[Constants.SessionConstants.UserSignUpModel].Should().Be(null);
        }

        private UserSignUpViewModel GetTestUserSignUpViewModel()
        {
            return new UserSignUpViewModel()
            {
                Country = "Ukraine",
                Email = "easygenerator@easygenerator.com",
                FirstName = "easygenerator user firstname",
                LastName = "easygenerator user lastname",
                Phone = "+380777777",
                Organization = "ism",
                Password = "UserPassword777",
                PeopleBusyWithCourseDevelopmentAmount = "5",
                NeedAuthoringTool = "Now",
                UsedAuthoringTool = "powerpoint"
            };
        }
        #endregion

        #region Forgot password

        [TestMethod]
        public void ForgotPassword_ShouldAddPasswordRecoveryTicket_WhenUserExists()
        {
            //Arrange
            const string email = "username@easygenerator.com";
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(email).Returns(user);

            var ticket = Substitute.For<PasswordRecoveryTicket>();
            _entityFactory.PasswordRecoveryTicket(user).Returns(ticket);

            //Act
            _controller.ForgotPassword(email);

            //Assert
            user.Received().AddPasswordRecoveryTicket(ticket);
        }

        [TestMethod]
        public void ForgotPassword_ShouldSendEmailToUser_WhenUserExists()
        {
            //Arrange
            const string email = "username@easygenerator.com";
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(email).Returns(user);

            var ticket = Substitute.For<PasswordRecoveryTicket>();
            _entityFactory.PasswordRecoveryTicket(user).Returns(ticket);

            //Act
            _controller.ForgotPassword(email);

            //Assert
            _mailSenderWrapper.Received().SendForgotPasswordMessage(email, ticket.Id.ToNString());
        }

        [TestMethod]
        public void ForgotPassword_ShouldReturnJsonSuccessResult()
        {
            var result = _controller.ForgotPassword(null);

            result.Should().BeJsonSuccessResult();
        }


        #endregion

        #region Recover Password

        [TestMethod]
        public void RecoverPassword_ShouldReturnJsonErrorResult_WhenTicketDoesNotExist()
        {
            var result = _controller.RecoverPassword(null, null);

            result.Should().BeJsonErrorResult();
        }

        [TestMethod]
        public void RecoverPassword_ShouldRecoverUserPassword()
        {
            //Arrange
            var ticket = Substitute.For<PasswordRecoveryTicket>();
            var user = Substitute.For<User>();
            ticket.User.Returns(user);

            const string password = "Abc123!";

            //Act
            _controller.RecoverPassword(ticket, password);

            //Assert
            //user.Received().RecoverPasswordUsingTicket(Arg.Any<string>(), password);
        }

        [TestMethod]
        public void RecoverPassword_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var ticket = Substitute.For<PasswordRecoveryTicket>();
            var user = Substitute.For<User>();
            ticket.User.Returns(user);

            const string password = "Abc123!";

            //Act
            var result = _controller.RecoverPassword(ticket, password);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region Exists

        [TestMethod]
        public void Exists_ShouldReturnJsonTrueResult_WhenUserWithSuchEmailExists()
        {
            //Arrange
            var email = "easygenerator@easygenerator.com";
            _userRepository.GetUserByEmail(email).Returns(UserObjectMother.CreateWithEmail(email));

            //Act
            var result = _controller.Exists(email);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.Should().Be(true);
        }

        [TestMethod]
        public void Exists_ShouldReturnJsonFalseResult_WhenUserWithSuchEmailNotExists()
        {
            //Arrange
            var email = "easygenerator@easygenerator.com";

            //Act
            var result = _controller.Exists(email);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.Should().Be(false);
        }

        #endregion

        #region GetCurrentUserInfo

        [TestMethod]
        public void GetCurrentUserInfo_ShouldReturnJsonSuccess_WhenUserIsNotAuthenticated()
        {
            //Arrange
            _user.Identity.IsAuthenticated.Returns(false);

            //Act
            var result = _controller.GetCurrentUserInfo();

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void GetCurrentUserInfo_ShouldReturnJsonSuccess_WhenUserDoesNotExist()
        {
            //Arrange
            const string userName = "5B63B14B-AB18-4B20-B6C8-D67AD769B337";

            _user.Identity.IsAuthenticated.Returns(true);
            _user.Identity.Name.Returns(userName);

            _userRepository.GetUserByEmail(userName).Returns((User)null);

            //Act
            var result = _controller.GetCurrentUserInfo();

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void GetCurrentUserInfo_ShouldReturnIsShowIntroductionPageTrue_WhenUserIsAnonymous()
        {
            //Arrange


            //Act
            var result = _controller.GetCurrentUserInfo();

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { IsShowIntroductionPage = true });
        }

        [TestMethod]
        public void GetCurrentUserInfo_ShouldReturnIsShowIntroductionPageTrue_WhenUserIsNotAnonymousAndNotClickDoNotShowAgain()
        {
            //Arrange
            const string email = "easygenerator@eg.com";
            _user.Identity.Name.Returns(email);
            _userRepository.GetUserByEmail(email).Returns(UserObjectMother.Create());

            //Act
            var result = _controller.GetCurrentUserInfo();

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { IsShowIntroductionPage = true });
        }

        [TestMethod]
        public void GetCurrentUserInfo_ShouldReturnIsShowIntroductionPageTrue_WhenUserIsNotAnonymousAndClickDoNotShowAgain()
        {
            //Arrange
            const string email = "easygenerator@eg.com";
            var user = UserObjectMother.Create();
            _user.Identity.Name.Returns(email);
            _userRepository.GetUserByEmail(email).Returns(user);
            user.UserSetting.UpdateIsShowIntroduction(false);

            //Act
            var result = _controller.GetCurrentUserInfo();

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { IsShowIntroductionPage = false });
        }

        #endregion

        #region SetIsShowIntroductionPage

        [TestMethod]
        public void SetIsShowIntroductionPage_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            const string email = "easygenerator@eg.com";
            _user.Identity.Name.Returns(email);
            _userRepository.GetUserByEmail(email).Returns(UserObjectMother.Create());

            //Act
            var result = _controller.SetIsShowIntroductionPage(true);

            //Assert
            result.Should().BeJsonSuccessResult();

        }

        [TestMethod]
        public void SetIsShowIntroductionPage_ShouldSetIsShowIntroductionPageToTrue_WhenUserIsNotCheckedDoNotShowAgain()
        {
            //Arrange
            const string email = "easygenerator@eg.com";
            var user = UserObjectMother.Create();
            _user.Identity.Name.Returns(email);
            _userRepository.GetUserByEmail(email).Returns(user);
            user.UserSetting.UpdateIsShowIntroduction(false);

            //Act
            _controller.SetIsShowIntroductionPage(true);

            //Assert
            user.UserSetting.IsShowIntroductionPage.Should().BeTrue();

        }

        [TestMethod]
        public void SetIsShowIntroductionPage_ShouldSetIsShowIntroductionPageToTrue_WhenUserIsCheckedDoNotShowAgain()
        {
            //Arrange
            const string email = "easygenerator@eg.com";
            var user = UserObjectMother.Create();
            _user.Identity.Name.Returns(email);
            _userRepository.GetUserByEmail(email).Returns(user);
            user.UserSetting.UpdateIsShowIntroduction(true);

            //Act
            _controller.SetIsShowIntroductionPage(false);

            //Assert
            user.UserSetting.IsShowIntroductionPage.Should().BeFalse();

        }

        #endregion SetIsShowIntroductionPage

        #region Identify

        [TestMethod]
        public void Identify_ShouldReturnEmptyJsonResult_WhenUserDoesNotExist()
        {
            //Arrange
            //const string email = "username@easygenerator.com";
            //_user.Identity.Name.Returns(email);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns((User)null);

            //Act
            var result = _controller.Identify();

            //Assert
            result.Should().BeJsonResult().And.Data.ShouldBeSimilar(new { });
        }

        [TestMethod]
        public void Identify_ShoudReturnJsonResultWithUserIdentity_WhenUserExists()
        {
            //Arrange
            var user = UserObjectMother.Create();
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(user);

            //Act
            var result = _controller.Identify();

            //Assert
            result.Should().BeJsonResult().And.Data.ShouldBeSimilar(new
            {
                email = user.Email,
                fullname = user.FirstName + " " + user.LastName,
                accessType = user.AccessType
            });
        }

        #endregion
    }
}
