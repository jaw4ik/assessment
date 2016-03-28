using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Clonning;
using easygenerator.Web.Components;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.InMemoryStorages;
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
        private IDomainEventPublisher _eventPublisher;
        private IMailSenderWrapper _mailSenderWrapper;
        private IReleaseNoteFileReader _releaseNoteFileReader;
        private ICourseRepository _courseRepository;
        private IOnboardingRepository _onboardingRepository;
        private IDemoCoursesStorage _demoCoursesInMemoryStorage;
        private ITemplateRepository _templateRepository;
        private ICloner _cloner;
        IPrincipal _user;
        HttpContextBase _context;

        private readonly DateTime CurrentDate = new DateTime(2014, 3, 19);
        [TestInitialize]
        public void InitializeContext()
        {
            _userRepository = Substitute.For<IUserRepository>();
            _entityFactory = Substitute.For<IEntityFactory>();
            _eventPublisher = Substitute.For<IDomainEventPublisher>();
            _mailSenderWrapper = Substitute.For<IMailSenderWrapper>();
            _courseRepository = Substitute.For<ICourseRepository>();
            _onboardingRepository = Substitute.For<IOnboardingRepository>();
            _demoCoursesInMemoryStorage = Substitute.For<IDemoCoursesStorage>();
            _templateRepository = Substitute.For<ITemplateRepository>();
            _cloner = Substitute.For<ICloner>();
            _releaseNoteFileReader = Substitute.For<IReleaseNoteFileReader>();

            _controller = new UserController(_userRepository,
                _entityFactory,
                _eventPublisher,
                _mailSenderWrapper,
                _releaseNoteFileReader
                );

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);

            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
            DateTimeWrapper.Now = () => CurrentDate;
        }


        #region Update

        [TestMethod]
        public void Update_ShouldThrowArgumentException_WhenUserDoesNotExists()
        {
            const string email = "test@test.test";
            _userRepository.GetUserByEmail(email).Returns((User)null);

            Action action = () => _controller.Update(email);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("email");
        }

        [TestMethod]
        public void Update_ShouldReturnSuccessResult_WhenUserExists()
        {
            const string email = "test@test.test";
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(email).Returns(user);

            var result = _controller.Update(email);

            result.Should().BeSuccessResult();
        }

        [TestMethod]
        public void Update_ShouldUpdatePassword_WhenPasswordDefined()
        {
            const string email = "test@test.test";
            const string password = "NewPassword111";
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(email).Returns(user);

            _controller.Update(email, password);

            user.Received().UpdatePassword(password, email);
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
        public void Update_ShouldThrowArgumentException_WhenCountryIsDefinedAndNotValid()
        {
            const string email = "test@test.test";
            const string country = "11";
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(email).Returns(user);

            Action action = () => _controller.Update(email, country: country);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("country");
        }

        #endregion

        #region Downgrade

        [TestMethod]
        public void Downgrade_ShouldThrowArgumentException_WhenUserDoesNotExists()
        {
            const string email = "test@test.test";
            _userRepository.GetUserByEmail(email).Returns((User)null);

            Action action = () => _controller.Downgrade(email);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("email");
        }

        [TestMethod]
        public void Downgrade_ShouldReturnSuccessResult_WhenUserExists()
        {
            const string email = "test@test.test";
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(email).Returns(user);

            var result = _controller.Downgrade(email);

            result.Should().BeSuccessResult();
        }

        [TestMethod]
        public void Downgrade_ShouldSetSubscriptionFreePlan()
        {
            const string email = "test@test.test";
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(email).Returns(user);

            _controller.Downgrade(email);

            user.Received().DowngradePlanToFree();
        }

        #endregion

        #region UpgradeToStarter

        [TestMethod]
        public void UpgradeToStarter_ShouldThrowArgumentException_WhenUserDoesNotExists()
        {
            const string email = "test@test.test";
            _userRepository.GetUserByEmail(email).Returns((User)null);

            Action action = () => _controller.UpgradeToStarter(email, DateTime.MaxValue);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("email");
        }

        [TestMethod]
        public void UpgradeToStarter_ShouldThrowArgumentException_WhenExpirationDateIsNull()
        {
            const string email = "test@test.test";
            _userRepository.GetUserByEmail(email).Returns((User)null);

            Action action = () => _controller.UpgradeToStarter(email, null);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("expirationDate");
        }

        [TestMethod]
        public void UpgradeToStarter_ShouldReturnSuccessResult_WhenUserExists()
        {
            const string email = "test@test.test";
            var user = UserObjectMother.CreateWithEmail(email);
            _userRepository.GetUserByEmail(email).Returns(user);

            var result = _controller.UpgradeToStarter(email, DateTime.MaxValue);

            result.Should().BeSuccessResult();
        }

        [TestMethod]
        public void UpgradeToStarter_ShouldSetSubscriptionStarterPlan()
        {
            const string email = "test@test.test";
            DateTime expDate = DateTime.MaxValue;
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(email).Returns(user);

            _controller.UpgradeToStarter(email, expDate);

            user.Received().UpgradePlanToStarter(expDate);
        }

        #endregion

        #region UpgradeToPlus

        [TestMethod]
        public void UpgradeToPlus_ShouldThrowArgumentException_WhenUserDoesNotExists()
        {
            const string email = "test@test.test";
            _userRepository.GetUserByEmail(email).Returns((User)null);

            Action action = () => _controller.UpgradeToPlus(email, DateTime.MaxValue);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("email");
        }

        [TestMethod]
        public void UpgradeToPlus_ShouldThrowArgumentException_WhenExpirationDateIsNull()
        {
            const string email = "test@test.test";
            _userRepository.GetUserByEmail(email).Returns((User)null);

            Action action = () => _controller.UpgradeToPlus(email, null);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("expirationDate");
        }

        [TestMethod]
        public void UpgradeToPlus_ShouldReturnSuccessResult_WhenUserExists()
        {
            const string email = "test@test.test";
            var user = UserObjectMother.CreateWithEmail(email);
            _userRepository.GetUserByEmail(email).Returns(user);

            var result = _controller.UpgradeToPlus(email, DateTime.MaxValue);

            result.Should().BeSuccessResult();
        }

        [TestMethod]
        public void UpgradeToPlus_ShouldSetSubscriptionPlusPlan()
        {
            const string email = "test@test.test";
            DateTime expDate = DateTime.MaxValue;
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(email).Returns(user);

            _controller.UpgradeToPlus(email, expDate);

            user.Received().UpgradePlanToPlus(expDate);
        }

        #endregion

        #region UpgradeToAcademy

        [TestMethod]
        public void UpgradeToAcademy_ShouldThrowArgumentException_WhenUserDoesNotExists()
        {
            const string email = "test@test.test";
            _userRepository.GetUserByEmail(email).Returns((User)null);

            Action action = () => _controller.UpgradeToAcademy(email, DateTime.MaxValue);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("email");
        }

        [TestMethod]
        public void UpgradeToAcademy_ShouldThrowArgumentException_WhenExpirationDateIsNull()
        {
            const string email = "test@test.test";
            _userRepository.GetUserByEmail(email).Returns((User)null);

            Action action = () => _controller.UpgradeToAcademy(email, null);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("expirationDate");
        }

        [TestMethod]
        public void UpgradeToAcademy_ShouldReturnSuccessResult_WhenUserExists()
        {
            const string email = "test@test.test";
            var user = UserObjectMother.CreateWithEmail(email);
            _userRepository.GetUserByEmail(email).Returns(user);

            var result = _controller.UpgradeToAcademy(email, DateTime.MaxValue);

            result.Should().BeSuccessResult();
        }

        [TestMethod]
        public void UpgradeToAcademy_ShouldSetSubscriptionPlusPlan()
        {
            const string email = "test@test.test";
            DateTime expDate = DateTime.MaxValue;
            var user = Substitute.For<User>();
            _userRepository.GetUserByEmail(email).Returns(user);

            _controller.UpgradeToAcademy(email, expDate);

            user.Received().UpgradePlanToPlus(expDate);
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
            var lastReadReleaseNote = "";
            var user = UserObjectMother.Create(profile.Email, profile.Password);

            _entityFactory.User(profile.Email, profile.Password, profile.FirstName, profile.LastName, profile.Phone, profile.Country, profile.UserRole, profile.Email, lastReadReleaseNote).Returns(user);

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
            var lastReadReleaseNote = "";
            var user = UserObjectMother.Create(profile.Email, profile.Password);
            _entityFactory.User(profile.Email, profile.Password, profile.FirstName, profile.LastName, profile.Phone, profile.Country, profile.UserRole, profile.Email, lastReadReleaseNote).Returns(user);

            //Act
            _controller.Signup(profile);

            //Assert
            _eventPublisher.Received().Publish(Arg.Is<UserSignedUpEvent>(_ => _.User == user && _.UserRole == profile.UserRole));
        }

        [TestMethod]
        public void Signup_ShouldRaiseEventAboutCreationInitialData()
        {
            //Arrange
            var profile = GetTestUserSignUpViewModel();
            var lastReadReleaseNote = "";
            var user = UserObjectMother.Create(profile.Email, profile.Password);
            _entityFactory.User(profile.Email, profile.Password, profile.FirstName, profile.LastName, profile.Phone, profile.Country, profile.UserRole, profile.Email, lastReadReleaseNote).Returns(user);

            //Act
            _controller.Signup(profile);

            //Assert
            _eventPublisher.Received().Publish(Arg.Is<CreateUserInitialDataEvent>(_ => _.User == user));
        }

        [TestMethod]
        public void Signup_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var profile = GetTestUserSignUpViewModel();
            var lastReadReleaseNote = "";
            var user = UserObjectMother.Create(profile.Email, profile.Password);
            _entityFactory.User(profile.Email, profile.Password, profile.FirstName, profile.LastName, profile.Phone, profile.Country, profile.UserRole, profile.Email, lastReadReleaseNote).Returns(user);

            //Act
            var result = _controller.Signup(profile);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.Should().Be(profile.Email);
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
                Password = "UserPassword777",
                UserRole = "not in the list"
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

        #region UpdateLastReadReleaseNoteVersion

        [TestMethod]
        public void UpdateLastReadReleaseNoteVersion_ShouldUpdateLastReadReleaseNote()
        {
            var email = "easygenerator@easygenerator.com";
            var user = UserObjectMother.CreateWithEmail(email);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(user);
            _releaseNoteFileReader.GetReleaseVersion().Returns("255");

           _controller.UpdateLastReadReleaseNoteVersion();

            user.Settings.LastReadReleaseNote.Should().Be("255");
        }

        [TestMethod]
        public void UpdateLastReadReleaseNoteVersion_ShouldReturnJsonSuccessResult()
        {
            var email = "easygenerator@easygenerator.com";
            var user = UserObjectMother.CreateWithEmail(email);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(user);
            _releaseNoteFileReader.GetReleaseVersion().Returns("255");

            var result = _controller.UpdateLastReadReleaseNoteVersion();

            result.Should().BeJsonSuccessResult();

        }

        #endregion

        #region UpdateLastReadReleaseNoteVersion

        [TestMethod]
        public void SwitchEditor_ShouldSwitchEditor()
        {
            var email = "easygenerator@easygenerator.com";
            var user = UserObjectMother.CreateWithEmail(email);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(user);
            
            _controller.SwitchEditor();

            user.Settings.NewEditor.Should().Be(false);
        }

        [TestMethod]
        public void SwitchEditor_ShouldReturnJsonSuccessResult()
        {
            var email = "easygenerator@easygenerator.com";
            var user = UserObjectMother.CreateWithEmail(email);
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(user);
            
            var result = _controller.SwitchEditor();

            result.Should().BeJsonSuccessResult();
        }

        #endregion
    }
}