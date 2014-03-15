using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Handlers;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Extensions;
using easygenerator.Web.Mail;
using easygenerator.Web.Tests.Utils;
using easygenerator.Web.ViewModels.Account;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
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
        private UserController _controller;
        private IEntityFactory _entityFactory;
        private IAuthenticationProvider _authenticationProvider;
        private ISignupFromTryItNowHandler _signupFromTryItNowHandler;
        private IDomainEventPublisher<UserSignedUpEvent> _publisher;
        private IMailSenderWrapper _mailSenderWrapper;
        private ConfigurationReader _configurationReader;

        IPrincipal _user;
        HttpContextBase _context;

        [TestInitialize]
        public void InitializeContext()
        {
            _userRepository = Substitute.For<IUserRepository>();
            _entityFactory = Substitute.For<IEntityFactory>();
            _authenticationProvider = Substitute.For<IAuthenticationProvider>();
            _signupFromTryItNowHandler = Substitute.For<ISignupFromTryItNowHandler>();
            _publisher = Substitute.For<IDomainEventPublisher<UserSignedUpEvent>>();
            _mailSenderWrapper = Substitute.For<IMailSenderWrapper>();
            _configurationReader = Substitute.For<ConfigurationReader>();

            _controller = new UserController(_userRepository, _entityFactory, _authenticationProvider, _signupFromTryItNowHandler, _publisher, _mailSenderWrapper, _configurationReader);

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);

            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }


        #region Update

        [TestMethod]
        public void Update_ShouldReturnBadRequestResult_WhenUserEmailIsNull()
        {
            var result = _controller.Update(null);

            result.Should().BeBadRequestResultWithDescription("Not valid email");
        }

        [TestMethod]
        public void Update_ShouldReturnBadRequestResult_WhenUserEmailIsEmpty()
        {
            var result = _controller.Update("");

            result.Should().BeBadRequestResultWithDescription("Not valid email");
        }

        [TestMethod]
        public void Update_ShouldReturnBadRequestResult_WhenUserDoesNotExists()
        {
            const string email = "test@test.test";
            _userRepository.GetUserByEmail(email).Returns((User)null);

            var result = _controller.Update(email);

            result.Should().BeBadRequestResultWithDescription("User doesn’t exist");
        }

        [TestMethod]
        public void Update_ShouldReturnHttpStatusCodeOK_WhenUserExists()
        {
            const string email = "test@test.test";
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(email).Returns(user);

            var result = _controller.Update(email);

            result.Should().BeHttpStatusCodeResultWithStatus(200);
        }

        [TestMethod]
        public void Update_ShouldUpdatePassword_WhenPasswordDefinedAndValid()
        {
            const string email = "test@test.test";
            const string password = "NewPassword111";
            var user = Substitute.For<User>();
            user.IsPasswordValid(password).Returns(true);
            _userRepository.GetUserByEmail(email).Returns(user);

            _controller.Update(email, password: password);

            user.Received().UpdatePassword(password, email);
        }

        [TestMethod]
        public void Update_ShouldReturnBadRequestResult_WhenPasswordDefinedAndNotValid()
        {
            const string email = "test@test.test";
            const string password = "NewPassword111";
            var user = Substitute.For<User>();
            user.IsPasswordValid(password).Returns(false);
            _userRepository.GetUserByEmail(email).Returns(user);

            var result = _controller.Update(email, password: password);

            result.Should().BeBadRequestResultWithDescription("Not valid password");
        }

        [TestMethod]
        public void Update_ShouldUpdateFirstName_WhenFirstNameIsDefined()
        {
            const string email = "test@test.test";
            const string firstName = "First Name";
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(email).Returns(user);

            _controller.Update(email, firstName: firstName);

            user.Received().UpdateFirstName(firstName, email);
        }

        [TestMethod]
        public void Update_ShouldUpdateLastName_WhenLastNameIsDefined()
        {
            const string email = "test@test.test";
            const string lastName = "Last Name";
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(email).Returns(user);

            _controller.Update(email, lastName: lastName);

            user.Received().UpdateLastName(lastName, email);
        }

        [TestMethod]
        public void Update_ShouldUpdatePhone_WhenPhoneIsDefined()
        {
            const string email = "test@test.test";
            const string phone = "123";
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(email).Returns(user);

            _controller.Update(email, phone: phone);

            user.Received().UpdatePhone(phone, email);
        }

        [TestMethod]
        public void Update_ShouldUpdateOrganization_WhenOrganizationIsDefined()
        {
            const string email = "test@test.test";
            const string organization = "Test Organization";
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(email).Returns(user);

            _controller.Update(email, organization: organization);

            user.Received().UpdateOrganization(organization, email);
        }

        [TestMethod]
        public void Update_ShouldUpdateCountry_WhenCountryIsDefined()
        {
            const string email = "test@test.test";
            const string country = "UA";
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(email).Returns(user);

            _controller.Update(email, country: country);

            user.Received().UpdateCountry("Ukraine", email);
        }

        [TestMethod]
        public void Update_ShouldUpdateCountry_WhenCountryIsDefinedAndLowCase()
        {
            const string email = "test@test.test";
            const string country = "ua";
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(email).Returns(user);

            _controller.Update(email, country: country);

            user.Received().UpdateCountry("Ukraine", email);
        }

        [TestMethod]
        public void Update_ShouldReturnBadRequestResult_WhenCountryIsDefinedAndNotValid()
        {
            const string email = "test@test.test";
            const string country = "11";
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(email).Returns(user);

            var result = _controller.Update(email, country: country);

            result.Should().BeBadRequestResultWithDescription("Country code passed in was invalid");
        }

        [TestMethod]
        public void Update_ShouldReturnUnitedKingdom_WhenCountryCodeIs_GB()
        {
            const string email = "test@test.test";
            const string country = "GB";
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(email).Returns(user);

            var result = _controller.Update(email, country: country);

            user.Received().UpdateCountry("United Kingdom", email);
        }

        #endregion

        #region Update Subscription

        [TestMethod]
        public void UpdateSubscription_ShouldReturnBadRequestResult_WhenUserEmailIsNull()
        {
            var result = _controller.UpdateSubscription(null, null, null);

            result.Should().BeBadRequestResultWithDescription("Not valid email");
        }

        [TestMethod]
        public void Updatesubscription_ShouldReturnBadRequestResult_WhenUserEmailIsEmpty()
        {
            var result = _controller.UpdateSubscription("", null, null);

            result.Should().BeBadRequestResultWithDescription("Not valid email");
        }

        [TestMethod]
        public void UpdateSubscription_ShouldReturnBadRequestResult_WhenUserDoesNotExists()
        {
            const string email = "test@test.test";
            _userRepository.GetUserByEmail(email).Returns((User)null);

            var result = _controller.UpdateSubscription(email, null, null);

            result.Should().BeBadRequestResultWithDescription("User doesn’t exist");
        }

        [TestMethod]
        public void UpdateSubscription_ShouldReturnBadRequestResult_WhenPlanIsNotDefinedInAccessType()
        {
            const string email = "test@test.test";
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(email).Returns(user);

            var result = _controller.UpdateSubscription(email, null, (AccessType?)6);

            result.Should().BeBadRequestResultWithDescription("Plan is not valid");
        }

        [TestMethod]
        public void UpdateSubscription_ShouldReturnHttpStatusCodeOK_WhenUserExists()
        {
            const string email = "test@test.test";
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(email).Returns(user);

            var result = _controller.UpdateSubscription(email, null, null);

            result.Should().BeHttpStatusCodeResultWithStatus(200);
        }

        [TestMethod]
        public void UpdateSubscription_ShouldUpdateAccessType_WhenPlanIsDefinedInAccessType()
        {
            const string email = "test@test.test";
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(email).Returns(user);

            _controller.UpdateSubscription(email, null, AccessType.Starter);

            user.Received().UpdatePlan(AccessType.Starter, email);
        }

        [TestMethod]
        public void UpdateSubscription_ShouldUpdateExpirationDate_WhenSubscriptionHasExpirationDate()
        {
            const string email = "test@test.test";
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(email).Returns(user);

            _controller.UpdateSubscription(email, (long?)123456, null);

            user.Received().UpdateExpirationDate(new DateTime(123456), email);
        }

        #endregion

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
            _configurationReader.UserTrialPeriod.Returns(10);
            var profile = GetTestUserSignUpViewModel();
            var user = UserObjectMother.Create(profile.Email, profile.Password);
            DateTimeWrapper.Now = () => DateTime.MinValue;
            var expirationTime = DateTime.MinValue.AddMinutes(10);

            _entityFactory.User(profile.Email, profile.Password, profile.FirstName, profile.LastName, profile.Phone, profile.Organization, profile.Country, profile.Email, Arg.Any<UserSettings>(), AccessType.Starter, expirationTime).Returns(user);

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
            _entityFactory.User(profile.Email, profile.Password, profile.FirstName, profile.LastName, profile.Phone, profile.Organization, profile.Country, profile.Email, Arg.Any<UserSettings>(), Arg.Any<AccessType>(), Arg.Any<DateTime>()).Returns(user);

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
            _entityFactory.User(profile.Email, profile.Password, profile.FirstName, profile.LastName, profile.Phone, profile.Organization, profile.Country, profile.Email, Arg.Any<UserSettings>(), Arg.Any<AccessType>(), Arg.Any<DateTime>()).Returns(user);

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
            _entityFactory.User(profile.Email, profile.Password, profile.FirstName, profile.LastName, profile.Phone, profile.Organization, profile.Country, profile.Email, Arg.Any<UserSettings>(), Arg.Any<AccessType>(), Arg.Any<DateTime>()).Returns(user);

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
            _entityFactory.User(profile.Email, profile.Password, profile.FirstName, profile.LastName, profile.Phone, profile.Organization, profile.Country, profile.Email, Arg.Any<UserSettings>(), Arg.Any<AccessType>(), Arg.Any<DateTime>()).Returns(user);

            //Act
            var result = _controller.Signup(profile);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.Should().Be(profile.Email);
        }

        [TestMethod]
        public void Signup_ShouldBeClearSession()
        {
            //Arrange
            var profile = GetTestUserSignUpViewModel();
            var user = UserObjectMother.Create(profile.Email, profile.Password);
            _entityFactory.User(profile.Email, profile.Password, profile.FirstName, profile.LastName, profile.Phone, profile.Organization, profile.Country, profile.Email, Arg.Any<UserSettings>(), Arg.Any<AccessType>(), Arg.Any<DateTime>()).Returns(user);
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
