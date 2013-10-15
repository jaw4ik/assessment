using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Handlers;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Components;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using easygenerator.Web.ViewModels.Account;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class UserControllerTests
    {
        private IUserRepository _repository;
        private UserController _controller;
        private IEntityFactory _entityFactory;
        private IAuthenticationProvider _authenticationProvider;
        private ISignupFromTryItNowHandler _signupFromTryItNowHandler;
        IPrincipal _user;
        HttpContextBase _context;

        [TestInitialize]
        public void InitializeContext()
        {
            _repository = Substitute.For<IUserRepository>();
            _entityFactory = Substitute.For<IEntityFactory>();
            _authenticationProvider = Substitute.For<IAuthenticationProvider>();
            _signupFromTryItNowHandler = Substitute.For<ISignupFromTryItNowHandler>();
            _controller = new UserController(_repository, _entityFactory, _authenticationProvider, _signupFromTryItNowHandler, Substitute.For<IHelpHintRepository>());

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
            _repository.GetUserByEmail(username).Returns(user);
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
            _repository.GetUserByEmail(username).Returns(user);
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
            _repository.GetUserByEmail(username).Returns(user);

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
            _repository.GetUserByEmail(email).Returns(UserObjectMother.CreateWithEmail(email));

            var profile = new UserSignUpViewModel() { Email = email, Password = "Some password" };
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
            var user = UserObjectMother.Create(email, password);

            _entityFactory.User(email, password, email).Returns(user);
            var profile = new UserSignUpViewModel() { Email = email , Password = password};
            //Act
            _controller.Signup(profile);

            //Assert
            _repository.Received().Add(user);
        }

        [TestMethod]
        public void Signup_ShouldHandleTryItNowModeContent_WhenUserWasInTryItNowMode()
        {
            //Arrange
            const string tryItNowUsername = "username";
            const string signUpUsername = "username@easygenerator.com";
            const string password = "Abc123!";
            var user = UserObjectMother.Create(signUpUsername, password);
            _user.Identity.IsAuthenticated.Returns(true);
            _user.Identity.Name.Returns(tryItNowUsername);
            _repository.GetUserByEmail(tryItNowUsername).Returns((User)null);
            _entityFactory.User(signUpUsername, password, signUpUsername).Returns(user);

            var profile = new UserSignUpViewModel() { Email = signUpUsername, Password = password };
            
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
            var user = UserObjectMother.Create(signUpUsername, password);
            _entityFactory.User(signUpUsername, password, signUpUsername).Returns(user);
            var profile = new UserSignUpViewModel() { Email = signUpUsername, Password = password };

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
            var user = UserObjectMother.Create(signUpUsername, password);
            _entityFactory.User(signUpUsername, password, signUpUsername).Returns(user);
            var profile = new UserSignUpViewModel() { Email = signUpUsername, Password = password };
            
            //Act
            var result = _controller.Signup(profile);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void Signup_ShouldUpdateUserFullName()
        {
            //Arrange
            const string signUpUsername = "username@easygenerator.com";
            const string password = "Abc123!";
            var profile = new UserSignUpViewModel() { Email = signUpUsername, Password = password, FullName = ""};
            var user = Substitute.For<User>();
            _entityFactory.User(signUpUsername, password, signUpUsername).Returns(user);

            //Act
            _controller.Signup(profile);

            //Assert
            user.Received().UpdateFullName("", signUpUsername);
        }

        [TestMethod]
        public void Signup_ShouldUpdateUserPhone()
        {
            //Arrange
            const string signUpUsername = "username@easygenerator.com";
            const string password = "Abc123!";
            var profile = new UserSignUpViewModel() { Email = signUpUsername, Password = password, Phone = "" };
            var user = Substitute.For<User>();
            _entityFactory.User(signUpUsername, password, signUpUsername).Returns(user);

            //Act
            _controller.Signup(profile);

            //Assert
            user.Received().UpdatePhone("", signUpUsername);
        }

        [TestMethod]
        public void Signup_ShouldUpdateUserOrganization()
        {
            //Arrange
            const string signUpUsername = "username@easygenerator.com";
            const string password = "Abc123!";
            var profile = new UserSignUpViewModel() { Email = signUpUsername, Password = password, Organization = "" };
            var user = Substitute.For<User>();
            _entityFactory.User(signUpUsername, password, signUpUsername).Returns(user);

            //Act
            _controller.Signup(profile);

            //Assert
            user.Received().UpdateOrganization("", signUpUsername);
        }

        #endregion

        #region Exists

        [TestMethod]
        public void Exists_ShouldReturnJsonTrueResult_WhenUserWithSuchEmailExists()
        {
            //Arrange
            var email = "easygenerator@easygenerator.com";
            _repository.GetUserByEmail(email).Returns(UserObjectMother.CreateWithEmail(email));

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

        #region isTryMode

        [TestMethod]
        public void IsTryMode_ShouldReturnJsonTrueResult_WhenUserIsAnonymous()
        {
            //Arrange

            //Act
            var result = _controller.IsTryMode();

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.Should().Be(true);
        }

        [TestMethod]
        public void IsTryMode_ShouldReturnJsonFalseResult_WhenUserIsNotAnonymous()
        {
            //Arrange
            var email = "easygenerator@eg.com";
            _user.Identity.Name.Returns(email);
            _repository.GetUserByEmail(email).Returns(UserObjectMother.Create());

            //Act
            var result = _controller.IsTryMode();

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.Should().Be(false);

        }

        #endregion

        #region GetCurrentUserInfo

        [TestMethod]
        public void GetCurrentUserEmail_ShouldReturnJsonSuccess_WhenUserIsNotAuthenticated()
        {
            //Arrange
            _user.Identity.IsAuthenticated.Returns(false);

            //Act
            var result = _controller.GetCurrentUserEmail();

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void GetCurrentUserEmail_ShouldReturnJsonSuccess_WhenUserDoesNotExist()
        {
            //Arrange
            var userName = "5B63B14B-AB18-4B20-B6C8-D67AD769B337";

            _user.Identity.IsAuthenticated.Returns(true);
            _user.Identity.Name.Returns(userName);

            _repository.GetUserByEmail(userName).Returns((User)null);

            //Act
            var result = _controller.GetCurrentUserEmail();

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void GetCurrentUserEmail_ShouldReturnJsonSuccessWithEmail_WhenUserIsSignedIn()
        {
            //Arrange
            var userEmail = "easygenerator@easygenerator.com";

            _user.Identity.IsAuthenticated.Returns(true);
            _user.Identity.Name.Returns(userEmail);

            _repository.GetUserByEmail(userEmail).Returns(Substitute.For<User>());

            //Act
            var result = _controller.GetCurrentUserEmail();

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { Email = "easygenerator@easygenerator.com" });
        }

        #endregion
    }
}
