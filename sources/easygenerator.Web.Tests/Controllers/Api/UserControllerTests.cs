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
            var email = "easygenerator@easygenerator.com";
            _userRepository.GetUserByEmail(email).Returns(UserObjectMother.CreateWithEmail(email));

            var profile = new UserSecondStepViewModel() { Email = email, Password = "Some password" };
            //Act
            var result = _controller.Signup(profile);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be("Account with this email already exists");
        }

        [TestMethod]
        public void Signup_ShouldAddUserToRepository()
        {
            //Arrange
            var email = "easygenerator@easygenerator.com";
            var password = "Easy123!";
            var fullname = "easygenerator user";
            var phone = "some phone";
            var organization = "Easygenerator";
            var country = "some country";
            var user = UserObjectMother.Create(email, password);

            _entityFactory.User(email, password, fullname, phone, organization, country, email).Returns(user);
            var profile = new UserSecondStepViewModel()
            {
                Email = email,
                Password = password,
                FullName = fullname,
                Phone = phone,
                Organization = organization,
                Country = country
            };
            //Act
            _controller.Signup(profile);

            //Assert
            _userRepository.Received().Add(user);
        }

        [TestMethod]
        public void Signup_ShouldRaiseEventAboutUserCreation()
        {
            //Arrange
            var email = "easygenerator@easygenerator.com";
            var password = "Easy123!";
            var fullname = "easygenerator user";
            var phone = "some phone";
            var organization = "Easygenerator";
            var country = "some country";
            var user = UserObjectMother.Create(email, password);
            var courseDevelopersCount = "5";
            var whenNeedAuthoringTool = "Now";
            var usedAuthoringTool = "powerpoint";

            _entityFactory.User(email, password, fullname, phone, organization, country, email).Returns(user);
            var profile = new UserSecondStepViewModel()
            {
                Email = email,
                Password = password,
                FullName = fullname,
                Phone = phone,
                Organization = organization,
                Country = country,
                PeopleBusyWithCourseDevelopmentAmount = courseDevelopersCount,
                NeedAuthoringTool = whenNeedAuthoringTool,
                UsedAuthoringTool = usedAuthoringTool
            };

            //Act
            _controller.Signup(profile);

            //Assert
            _publisher.Received().Publish
                (
                    Arg.Is<UserSignedUpEvent>(_ => _.User == user && _.UsedAuthoringTool == usedAuthoringTool && _.CourseDevelopersCount == courseDevelopersCount
                    && _.WhenNeedAuthoringTool == whenNeedAuthoringTool)
                );
        }

        [TestMethod]
        public void Signup_ShouldHandleTryItNowModeContent_WhenUserWasInTryItNowMode()
        {
            //Arrange
            const string tryItNowUsername = "username";
            const string signUpUsername = "username@easygenerator.com";
            const string password = "Abc123!";
            var fullname = "easygenerator user";
            var phone = "some phone";
            var organization = "Easygenerator";
            var country = "some country";
            var user = UserObjectMother.Create(signUpUsername, password);
            _user.Identity.IsAuthenticated.Returns(true);
            _user.Identity.Name.Returns(tryItNowUsername);
            _userRepository.GetUserByEmail(tryItNowUsername).Returns((User)null);
            _entityFactory.User(signUpUsername, password, fullname, phone, organization, country, signUpUsername).Returns(user);

            var profile = new UserSecondStepViewModel()
            {
                Email = signUpUsername,
                Password = password,
                FullName = fullname,
                Phone = phone,
                Organization = organization,
                Country = country
            };

            //Act
            _controller.Signup(profile);

            //Assert
            _signupFromTryItNowHandler.Received().HandleOwnership(tryItNowUsername, signUpUsername);
        }

        [TestMethod]
        public void Signup_ShouldSignInNewUser()
        {
            //Arrange
            const string signUpUsername = "username@easygenerator.com";
            const string password = "Abc123!";
            var fullname = "easygenerator user";
            var phone = "some phone";
            var organization = "Easygenerator";
            var country = "some country";
            var user = UserObjectMother.Create(signUpUsername, password);
            _entityFactory.User(signUpUsername, password, fullname, phone, organization, country, signUpUsername).Returns(user);
            var profile = new UserSecondStepViewModel()
            {
                Email = signUpUsername,
                Password = password,
                FullName = fullname,
                Phone = phone,
                Organization = organization,
                Country = country
            };

            //Act
            _controller.Signup(profile);

            //Assert
            _authenticationProvider.Received().SignIn(profile.Email, true);
        }

        [TestMethod]
        public void Signup_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            const string signUpUsername = "username@easygenerator.com";
            const string password = "Abc123!";
            var fullname = "easygenerator user";
            var phone = "some phone";
            var organization = "Easygenerator";
            var country = "some country";
            var user = UserObjectMother.Create(signUpUsername, password);
            _entityFactory.User(signUpUsername, password, fullname, phone, organization, country, signUpUsername).Returns(user);
            var profile = new UserSecondStepViewModel()
            {
                Email = signUpUsername,
                Password = password,
                FullName = fullname,
                Phone = phone,
                Organization = organization,
                Country = country
            };

            //Act
            var result = _controller.Signup(profile);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.Should().Be(signUpUsername);
        }

        [TestMethod]
        public void SignUp_ShouldNotCreateHelpHintsForUser_WhenUserSignupFromTry()
        {
            //Arrange
            const string signUpUsername = "username@easygenerator.com";
            const string password = "Abc123!";
            var fullname = "easygenerator user";
            var phone = "some phone";
            var organization = "Easygenerator";
            var country = "some country";
            var profile = new UserSecondStepViewModel()
            {
                Email = signUpUsername,
                Password = password,
                FullName = fullname,
                Phone = phone,
                Organization = organization,
                Country = country
            };
            var user = Substitute.For<User>();
            _entityFactory.User(signUpUsername, password, fullname, phone, organization, country, signUpUsername).Returns(user);
            _user.Identity.IsAuthenticated.Returns(true);

            //Act
            _controller.Signup(profile);

            //Assert
            _helpHintRepository.DidNotReceive().CreateHelpHintsForUser(signUpUsername);
        }

        [TestMethod]
        public void SignUp_ShouldNotCreateHelpHintsForUser_WhenUserSignup()
        {
            //Arrange
            const string signUpUsername = "username@easygenerator.com";
            const string password = "Abc123!";
            var fullname = "easygenerator user";
            var phone = "some phone";
            var organization = "Easygenerator";
            var country = "some country";
            var profile = new UserSecondStepViewModel()
            {
                Email = signUpUsername,
                Password = password,
                FullName = fullname,
                Phone = phone,
                Organization = organization,
                Country = country
            };
            var user = Substitute.For<User>();
            _entityFactory.User(signUpUsername, password, fullname, phone, organization, country, signUpUsername).Returns(user);
            _user.Identity.IsAuthenticated.Returns(false);

            //Act
            _controller.Signup(profile);

            //Assert
            _helpHintRepository.Received().CreateHelpHintsForUser(signUpUsername);
        }

        [TestMethod]
        public void SignUp_ShouldUpdateUserSugnUpModelFromSession()
        {
            //Arrange
            var email = "easygenerator@easygenerator.com";
            var password = "Easy123!";
            var fullname = "easygenerator user";
            var phone = "some phone";
            var organization = "Easygenerator";
            var country = "some country";
            var user = UserObjectMother.Create(email, password);
            var profile = new UserSecondStepViewModel()
            {
                NeedAuthoringTool = "Some tool",
                PeopleBusyWithCourseDevelopmentAmount = "Some count of people",
                UsedAuthoringTool = "Some used tool"
            };
            _context.Session[Constants.SessionConstants.UserSignUpModel].Returns(new UserSignUpViewModel()
            {
                Email = email,
                Password = password,
                FullName = fullname,
                Phone = phone,
                Organization = organization,
                Country = country
            });
            var resultProfile = new UserSecondStepViewModel()
            {
                Email = email,
                Password = password,
                NeedAuthoringTool = "Some tool",
                PeopleBusyWithCourseDevelopmentAmount = "Some count of people",
                UsedAuthoringTool = "Some used tool"
            };
            _entityFactory.User(email, password, fullname, phone, organization, country, email).Returns(user);
            //Act
            _controller.Signup(profile);

            //Assert
            profile.Email.Should().Be(resultProfile.Email);
            profile.Password.Should().Be(resultProfile.Password);
        }

        [TestMethod]
        public void Signup_ShouldBeClearSession()
        {
            //Arrange
            string email = "easygenerator@easygenerator.com";
            string password = "Abc123!";
            var fullname = "easygenerator user";
            var phone = "some phone";
            var organization = "Easygenerator";
            var country = "some country";
            var user = UserObjectMother.Create(email, password);
            _entityFactory.User(email, password, fullname, phone, organization, country, email).Returns(user);
            var profile = new UserSecondStepViewModel()
            {
                Email = email,
                Password = password,
                FullName = fullname,
                Phone = phone,
                Organization = organization,
                Country = country
            };
            _context.Session[Constants.SessionConstants.UserSignUpModel].Returns(profile);

            //Act

            _controller.Signup(profile);
            //Assert

            _context.Session[Constants.SessionConstants.UserSignUpModel].Should().Be(null);
        }

        #endregion

        #region SignUpFirstStep

        [TestMethod]
        public void SignUpFirstStep_ShouldReturnJsonErrorResult_WhenUserWithSuchEmailExists()
        {
            //Arrange
            var email = "easygenerator@easygenerator.com";
            _userRepository.GetUserByEmail(email).Returns(UserObjectMother.CreateWithEmail(email));
            var profile = new UserSignUpViewModel() { Email = email, Password = "Some password" };

            //Act
            var result = _controller.SignUpFirstStep(profile);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be("Account with this email already exists");
        }

        [TestMethod]
        public void SignUpFirstStep_ShouldSetCurrentSesionWithValueProfile()
        {
            //Arrange
            var profile = new UserSignUpViewModel() { Email = "Some email", Password = "Some password" };

            //Act
            _controller.SignUpFirstStep(profile);

            //Assert
            (_context.Session[Constants.SessionConstants.UserSignUpModel] as UserSignUpViewModel).Should().Be(profile);
        }

        [TestMethod]
        public void SignUpFirstStep_ShouldReturnJsonSuccessResult_WhenUerWithSuchEmailNotExists()
        {
            //Arrange

            var profile = new UserSignUpViewModel() { Email = "Some email", Password = "Some password" };
            //Act

            var result = _controller.SignUpFirstStep(profile);
            //Assert

            result.Should().BeJsonSuccessResult();
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
            _mailSenderWrapper.Received().SendForgotPasswordMessage(email, ticket.Id.ToString("N"));
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
        public void GetCurrentUserInfo_ShouldReturnJsonSuccessWithEmail_WhenUserIsSignedIn()
        {
            //Arrange
            const string userEmail = "easygenerator@easygenerator.com";

            _user.Identity.IsAuthenticated.Returns(true);
            _user.Identity.Name.Returns(userEmail);

            var user = Substitute.For<User>(userEmail, "Password1", "FullName", "Phone", "OrganizationName", "Country", userEmail);

            _userRepository.GetUserByEmail(userEmail).Returns(user);

            //Act
            var result = _controller.GetCurrentUserInfo();

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { Email = "easygenerator@easygenerator.com" });
        }

        [TestMethod]
        public void GetCurrentUserInfo_ShouldReturnJsonSuccessResultWithIsTryModeTrue_WhenUserIsAnonymous()
        {
            //Arrange

            //Act
            var result = _controller.GetCurrentUserInfo();

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { IsTryMode = true });
        }

        [TestMethod]
        public void GetCurrentUserInfo_ShouldReturnJsonSuccessResultWithIsTryModeFalse_WhenUserIsNotAnonymous()
        {
            //Arrange
            const string email = "easygenerator@eg.com";
            _user.Identity.Name.Returns(email);
            _userRepository.GetUserByEmail(email).Returns(UserObjectMother.Create());

            //Act
            var result = _controller.GetCurrentUserInfo();

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { IsTryMode = false });

        }

        #endregion
    }
}
