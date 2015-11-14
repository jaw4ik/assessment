using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Linq;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class UserTests
    {
        private const string CreatedBy = "easygenerator2@easygenerator.com";
        private readonly DateTime CurrentDate = new DateTime(2014, 3, 19);

        [TestInitialize]
        public void InitializeContext()
        {
            DateTimeWrapper.Now = () => CurrentDate;
        }

        #region Constructor

        [TestMethod]
        public void User_ShouldThrowArgumentNullException_WhenEmailIsNull()
        {
            //Arrange
            Action action = () => UserObjectMother.CreateWithEmail(null);

            //Act & Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("email");
        }

        [TestMethod]
        public void User_ShouldThrowArgumentException_WhenEmailIsEmpty()
        {
            //Arrange
            Action action = () => UserObjectMother.CreateWithEmail(String.Empty);

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("email");
        }

        [TestMethod]
        public void User_ShouldThrowArgumentException_WhenEmailLengthBiggerthen254Characters()
        {
            //Arrange
            Action action = () => UserObjectMother.CreateWithEmail("0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789@t.ru");

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("email");
        }

        [TestMethod]
        public void User_ShouldThrowArgumentException_WhenEmailIsInvalid()
        {
            //Arrange
            Action action = () => UserObjectMother.CreateWithEmail("sdasdasdasdads");

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("email");
        }

        [TestMethod]
        public void User_ShouldThrowArgumentNullException_WhenPasswordIsNull()
        {
            //Arrange
            Action action = () => UserObjectMother.CreateWithPassword(null);

            //Act & Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("password");
        }

        [TestMethod]
        public void User_ShouldThrowArgumentException_WhenPasswordIsEmpty()
        {
            //Arrange
            Action action = () => UserObjectMother.CreateWithPassword(String.Empty);

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("password");
        }

        [TestMethod]
        public void User_ShouldThrowArgumentException_WhenPasswordShorterThanSevenSymbols()
        {
            //Arrange
            Action action = () => UserObjectMother.CreateWithPassword("OLOLO");

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("password");
        }

        [TestMethod]
        public void User_ShouldThrowArgumentException_WhenPasswordHasWhitespaceSymbol()
        {
            //Arrange
            Action action = () => UserObjectMother.CreateWithPassword("Olol olo1!");

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("password");
        }

        [TestMethod]
        public void User_ShouldThrowArgumentNullException_WhenFirstNameIsNull()
        {
            //Arrange
            Action action = () => UserObjectMother.CreateWithFirstName(null);

            //Act & Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("firstname");
        }

        [TestMethod]
        public void User_ShouldThrowArgumentNullException_WhenLastNameIsNull()
        {
            //Arrange
            Action action = () => UserObjectMother.CreateWithLastName(null);

            //Act & Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("lastname");
        }

        [TestMethod]
        public void User_ShouldThrowArgumentNullException_WhenPhoneIsNull()
        {
            //Arrange
            Action action = () => UserObjectMother.CreateWithPhone(null);

            //Act & Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("phone");
        }

        [TestMethod]
        public void User_ShouldThrowArgumentNullException_WhenCountryIsNull()
        {
            //Arrange
            Action action = () => UserObjectMother.CreateWithCountry(null);

            //Act & Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("country");
        }

        [TestMethod]
        public void User_ShouldThrowArgumentNullException_WhenFirstNameIsEmpty()
        {
            //Arrange
            Action action = () => UserObjectMother.CreateWithFirstName("");

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("firstname");
        }

        [TestMethod]
        public void User_ShouldThrowArgumentNullException_WhenLastNameIsEmpty()
        {
            //Arrange
            Action action = () => UserObjectMother.CreateWithLastName("");

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("lastname");
        }

        [TestMethod]
        public void User_ShouldThrowArgumentNullException_WhenPhoneIsEmpty()
        {
            //Arrange
            Action action = () => UserObjectMother.CreateWithPhone("");

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("phone");
        }

        [TestMethod]
        public void User_ShouldThrowArgumentNullException_WhenCountryIsEmpty()
        {
            //Arrange
            Action action = () => UserObjectMother.CreateWithCountry("");

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("country");
        }

        [TestMethod]
        public void User_ShouldThrowArgumentException_WhenExpirationDateSpecified_AndDateTimeLessThanSqlMinDate()
        {
            var minDate = new DateTime(2000, 1, 1);
            DateTimeWrapper.MinValue = () => minDate;

            var email = "easygenerator3@easygenerator.com";
            var password = "Easy123!";
            var firstname = "easygenerator user firstname";
            var lastname = "easygenerator user lastname";
            var phone = "some phone";
            var country = "some country";
            var role = "Teacher";
            var accessPlan = AccessType.Starter;
            var lastReadReleaseNote = "1.0.0";

            Action action = () => UserObjectMother.Create(email, password, firstname, lastname, phone, country, role, CreatedBy, accessPlan, lastReadReleaseNote, new DateTime(1999, 12, 30));
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("expirationDate");
        }

        [TestMethod]
        public void User_ShouldCreateUser()
        {
            //Arrange
            var email = "easygenerator3@easygenerator.com";
            var password = "Easy123!";
            var firstname = "easygenerator user firstname";
            var lastname = "easygenerator user lastname";
            var phone = "some phone";
            var country = "some country";
            var role = "Teacher";
            var creationDate = CurrentDate;
            var accessPlan = AccessType.Starter;
            var lastReadReleaseNote = "1.0.0";

            //Act
            var expirationDate = DateTimeWrapper.Now().AddDays(20);
            var user = UserObjectMother.Create(email, password, firstname, lastname, phone, country, role, CreatedBy, accessPlan, lastReadReleaseNote, expirationDate);

            //Assert
            user.Id.Should().NotBeEmpty();
            user.Email.Should().Be(email);
            user.VerifyPassword(password).Should().BeTrue();
            user.FirstName.Should().Be(firstname);
            user.LastName.Should().Be(lastname);
            user.Phone.Should().Be(phone);
            user.Country.Should().Be(country);
            user.CreatedOn.Should().Be(creationDate);
            user.ModifiedOn.Should().Be(creationDate);
            user.CreatedBy.Should().Be(CreatedBy);
            user.ModifiedBy.Should().Be(CreatedBy);
            user.AccessType.Should().Be(accessPlan);
            user.ExpirationDate.Should().Be(expirationDate);
            user.LastReadReleaseNote.Should().Be(lastReadReleaseNote);
        }

        [TestMethod]
        public void User_ShouldCreateUserWithTrialPlanwith14DaysTrialPeriod_IfExpirationDateIsNotSpecified()
        {
            //Arrange
            var expirationDate = CurrentDate.AddDays(14);

            //Act
            var user = UserObjectMother.Create();

            //Assert
            user.AccessType.Should().Be(AccessType.Trial);
            user.ExpirationDate.Should().Be(expirationDate);
        }

        #endregion

        #region VerifyPassword

        [TestMethod]
        public void VerifyPassword_ShouldReturnTrue_WhenPasswordIsCorrect()
        {
            //Arrange
            var password = "Easy123!";
            var user = UserObjectMother.CreateWithPassword(password);


            //Act
            var result = user.VerifyPassword(password);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void VerifyPassword_ShouldReturnFalse_WhenPasswordIsNotCorrect()
        {
            //Arrange
            var password = "Easy123!";
            var user = UserObjectMother.CreateWithPassword(password);


            //Act
            var result = user.VerifyPassword(password + "2");

            //Assert
            result.Should().BeFalse();
        }

        #endregion

        #region GetFullName

        [TestMethod]
        public void GetFullName_ShouldReturnFullName()
        {
            //Arrange
            var user = UserObjectMother.Create();


            //Act
            var result = user.FullName;

            //Assert
            result.Should().Be(user.FirstName + " " + user.LastName);
        }

        #endregion GetFullName

        #region Add password recovery ticket

        [TestMethod]
        public void AddPasswordRecoveryTicket_ShouldRemovePreviousTickets()
        {
            var user = UserObjectMother.Create();
            var ticket = PasswordRecoveryTicketObjectMother.Create();
            user.PasswordRecoveryTicketCollection.Add(ticket);

            user.AddPasswordRecoveryTicket(PasswordRecoveryTicketObjectMother.Create());

            user.PasswordRecoveryTicketCollection.Should().NotContain(t => t == ticket);
        }

        [TestMethod]
        public void AddPasswordRecoveryTicket_ShouldAddPasswordRecoveryTicket()
        {
            var user = UserObjectMother.Create();
            var ticket = PasswordRecoveryTicketObjectMother.Create();

            user.AddPasswordRecoveryTicket(ticket);

            user.PasswordRecoveryTicketCollection.Should().Contain(ticket);
        }

        [TestMethod]
        public void AddPasswordRecoveryTicket_ShouldUnsetUserFromPreviousTickets()
        {
            var user = UserObjectMother.Create();
            var ticket = PasswordRecoveryTicketObjectMother.Create();
            ticket.User = user;
            user.PasswordRecoveryTicketCollection.Add(ticket);

            user.AddPasswordRecoveryTicket(PasswordRecoveryTicketObjectMother.Create());

            ticket.User.Should().BeNull();
        }

        [TestMethod]
        public void AddPasswordRecoveryTicket_ShouldSetUserToPasswordRecoveryTicket()
        {
            var user = UserObjectMother.Create();
            var ticket = PasswordRecoveryTicketObjectMother.Create();

            user.AddPasswordRecoveryTicket(ticket);

            ticket.User.Should().Be(user);
        }

        #endregion

        #region Recover password using ticket

        [TestMethod]
        public void RecoverPasswordUsingTicket_ShouldThrowArgumentNullException_WhenPasswordIsNull()
        {
            var user = UserObjectMother.Create();
            var ticket = PasswordRecoveryTicketObjectMother.Create();

            Action action = () => user.RecoverPasswordUsingTicket(ticket, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("password");
        }

        [TestMethod]
        public void RecoverPasswordUsingTicket_ShouldThrowArgumentException_WhenPasswordIsEmpty()
        {
            var user = UserObjectMother.Create();
            var ticket = PasswordRecoveryTicketObjectMother.Create();

            Action action = () => user.RecoverPasswordUsingTicket(ticket, String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("password");
        }

        [TestMethod]
        public void RecoverPasswordUsingTicket_ShouldThrowArgumentException_WhenPasswordShorterThanSevenSymbols()
        {
            var user = UserObjectMother.Create();
            var ticket = PasswordRecoveryTicketObjectMother.Create();

            Action action = () => user.RecoverPasswordUsingTicket(ticket, "");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("password");
        }

        [TestMethod]
        public void RecoverPasswordUsingTicket_ShouldThrowArgumentException_WhenPasswordHasWhitespaceSymbol()
        {
            var user = UserObjectMother.Create();
            var ticket = PasswordRecoveryTicketObjectMother.Create();

            Action action = () => user.RecoverPasswordUsingTicket(ticket, "abcd efghij klmn1");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("password");
        }

        [TestMethod]
        public void RecoverPasswordUsingTicket_ShouldThrowArgumentNullException_WhenTicketIsNull()
        {
            var user = UserObjectMother.Create();
            Action action = () => user.RecoverPasswordUsingTicket(null, "Easy123!");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("ticket");
        }

        [TestMethod]
        public void RecoverPasswordUsingTicket_ShouldThrowInvalidOperationException_WhenTicketDoesNotExist()
        {
            var user = UserObjectMother.Create();
            var ticket = PasswordRecoveryTicketObjectMother.Create();
            Action action = () => user.RecoverPasswordUsingTicket(ticket, "Easy123!");

            action.ShouldThrow<InvalidOperationException>();
        }

        [TestMethod]
        public void RecoverPasswordUsingTicket_ShouldUpdatePasswordHash()
        {
            var user = UserObjectMother.Create();
            var ticket = PasswordRecoveryTicketObjectMother.Create();
            user.PasswordRecoveryTicketCollection.Add(ticket);
            const string password = "easyGenerAtoR123!";

            user.RecoverPasswordUsingTicket(ticket, password);

            user.PasswordHash.Should().Be(Cryptography.GetHash(password));
        }

        [TestMethod]
        public void RecoverPasswordUsingTicket_ShouldRemoveTicket()
        {
            var user = UserObjectMother.Create();
            var ticket = PasswordRecoveryTicketObjectMother.Create();
            user.PasswordRecoveryTicketCollection.Add(ticket);
            const string password = "easyGenerAtoR123!";

            user.RecoverPasswordUsingTicket(ticket, password);

            user.PasswordRecoveryTicketCollection.Should().NotContain(ticket);
        }

        [TestMethod]
        public void RecoverPasswordUsingTicket_ShouldAddUserUpdateEvent()
        {
            var user = UserObjectMother.Create();
            var ticket = PasswordRecoveryTicketObjectMother.Create();
            user.PasswordRecoveryTicketCollection.Add(ticket);
            const string password = "easyGenerAtoR123!";

            user.RecoverPasswordUsingTicket(ticket, password);

            user.Events.Should().HaveCount(1).And.OnlyContain(e => e.GetType() == typeof(UserUpdateEvent));
        }
        #endregion

        #region IsFreeAccess

        [TestMethod]
        public void IsFreeAccess_ShouldReturnTrue_WhenUserIsFreeAccessType()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Free;

            //Act
            var result = user.IsFreeAccess();

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void IsFreeAccess_ShouldReturnTrue_WhenUserAccessExpired()
        {
            //Arrange
            var user = UserObjectMother.Create();
            DateTimeWrapper.Now = () => new DateTime(2015, 1, 1);

            //Act
            var result = user.IsFreeAccess();

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void IsFreeAccess_ShouldReturnTrue_WhenUserIsFreeAccessTypeAndAccessExpired()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Free;
            DateTimeWrapper.Now = () => new DateTime(2015, 1, 1);

            //Act
            var result = user.IsFreeAccess();

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void IsFreeAccess_ShouldReturnTrue_ExpirationDateIsNotSet()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.ExpirationDate = null;

            //Act
            var result = user.IsFreeAccess();

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void IsFreeAccess_ShouldReturnFalse_WhenUserHasStarterAccess()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Starter;

            //Act
            var result = user.IsFreeAccess();

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void IsFreeAccess_ShouldReturnTrue_WhenUserHasStarterAccessButAccessExpired()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Starter;
            DateTimeWrapper.Now = () => new DateTime(2015, 1, 1);

            //Act
            var result = user.IsFreeAccess();

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void IsFreeAccess_ShouldReturnFalse_WhenUserHasPlusAccess()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Plus;

            //Act
            var result = user.IsFreeAccess();

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void IsFreeAccess_ShouldReturnFalse_WhenUserHasTrialAccess()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Trial;

            //Act
            var result = user.IsFreeAccess();

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void IsFreeAccess_ShouldReturnTrue_WhenUserHasPlusAccessButAccessExpired()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Plus;
            DateTimeWrapper.Now = () => new DateTime(2015, 1, 1);

            //Act
            var result = user.IsFreeAccess();

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void IsFreeAccess_ShouldReturnTrue_WhenUserHasTrialAccessButAccessExpired()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Trial;
            DateTimeWrapper.Now = () => new DateTime(2015, 1, 1);

            //Act
            var result = user.IsFreeAccess();

            //Assert
            result.Should().BeTrue();
        }

        #endregion

        #region HasStarterAccess

        [TestMethod]
        public void HasStarterAccess_ShouldReturnFalse_WhenUserHasFreeAccessType()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Free;

            //Act
            var result = user.HasStarterAccess();

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void HasStarterAccess_ShouldReturnTrue_WhenUserAccessTypeIsStarter()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Starter;

            //Act
            var result = user.HasStarterAccess();

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasStarterAccess_ShouldReturnFalse_WhenUserAccessTypeIsStarterButAccessExpired()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Starter;
            DateTimeWrapper.Now = () => new DateTime(2015, 1, 1);
            //Act
            var result = user.HasStarterAccess();

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void HasStarterAccess_ShouldReturnFalse_WhenUserAccessTypeIsStarterButExpirationDateIsNotSet()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Starter;
            user.ExpirationDate = null;
            //Act
            var result = user.HasStarterAccess();

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void HasStarterAcces_ShouldReturnTrue_WhenUserAccessTypeIsPlus()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Plus;

            //Act
            var result = user.HasStarterAccess();

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasStarterAcces_ShouldReturnTrue_WhenUserAccessTypeIsTrial()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Trial;

            //Act
            var result = user.HasStarterAccess();

            //Assert
            result.Should().BeTrue();
        }


        [TestMethod]
        public void HasStarterAccess_ShouldReturnFalse_WhenUserAccessTypeIsPlusButAccessExpired()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Plus;
            DateTimeWrapper.Now = () => new DateTime(2015, 1, 1);
            //Act
            var result = user.HasStarterAccess();

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void HasStarterAccess_ShouldReturnFalse_WhenUserAccessTypeIsTrialButAccessExpired()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Trial;
            DateTimeWrapper.Now = () => new DateTime(2015, 1, 1);
            //Act
            var result = user.HasStarterAccess();

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void HasStarterAccess_ShouldReturnFalse_WhenUserAccessTypeIsPlusButExpirationDateIsNotSet()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Plus;
            user.ExpirationDate = null;
            //Act
            var result = user.HasStarterAccess();

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void HasStarterAccess_ShouldReturnFalse_WhenUserAccessTypeIsTrialButExpirationDateIsNotSet()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Trial;
            user.ExpirationDate = null;
            //Act
            var result = user.HasStarterAccess();

            //Assert
            result.Should().BeFalse();
        }

        #endregion

        #region HasPlusAccess

        [TestMethod]
        public void HasPlusAccess_ShouldReturnFalse_WhenUserHasFreeAccessType()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Free;

            //Act
            var result = user.HasPlusAccess();

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void HasPlusAccess_ShouldReturnFalse_WhenUserAccessTypeIsStarter()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Starter;

            //Act
            var result = user.HasPlusAccess();

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void HasPlusAcces_ShouldReturnTrue_WhenUserAccessTypeIsPlus()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Plus;

            //Act
            var result = user.HasPlusAccess();

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasPlusAccess_ShouldReturnFalse_WhenUserAccessTypeIsPlusButAccessExpired()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Plus;
            DateTimeWrapper.Now = () => new DateTime(2015, 1, 1);
            //Act
            var result = user.HasPlusAccess();

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void HasPlusAccess_ShouldReturnFalse_WhenUserAccessTypeIsPlusButExpirationDateIsNotSet()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Plus;
            user.ExpirationDate = null;
            //Act
            var result = user.HasPlusAccess();

            //Assert
            result.Should().BeFalse();
        }

        #endregion

        #region HasTrialAccess

        [TestMethod]
        public void HasTrialAccess_ShouldReturnFalse_WhenUserHasFreeAccessType()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Free;

            //Act
            var result = user.HasTrialAccess();

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void HasTrialAccess_ShouldReturnFalse_WhenUserAccessTypeIsStarter()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Starter;

            //Act
            var result = user.HasTrialAccess();

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void HasTrialAccess_ShouldReturnFalse_WhenUserAccessTypeIsPlus()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Plus;

            //Act
            var result = user.HasTrialAccess();

            //Assert
            result.Should().BeFalse();
        }


        [TestMethod]
        public void HasTrialAccess_ShouldReturnTrue_WhenUserAccessTypeIsTrial()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Trial;

            //Act
            var result = user.HasTrialAccess();

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void HasTrialAccess_ShouldReturnFalse_WhenUserAccessTypeIsTrialButAccessExpired()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Trial;
            DateTimeWrapper.Now = () => new DateTime(2015, 1, 1);
            //Act
            var result = user.HasTrialAccess();

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void HasTrialAccess_ShouldReturnFalse_WhenUserAccessTypeIsHasTrialAccessButExpirationDateIsNotSet()
        {
            //Arrange
            var user = UserObjectMother.Create();
            user.AccessType = AccessType.Trial;
            user.ExpirationDate = null;
            //Act
            var result = user.HasTrialAccess();

            //Assert
            result.Should().BeFalse();
        }

        #endregion

        #region UpdatePassword

        [TestMethod]
        public void UpdatePassword_ShouldThrowArgumentException_WhenPasswordIsNull()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdatePassword(null, "admin");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("password");
        }

        [TestMethod]
        public void UpdatePassword_ShouldThrowArgumentException_WhenModifiedByIsNull()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdatePassword("Easy123!", null);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdatePassword_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdatePassword("Easy123!", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdatePassword_ShouldThrowArgumentException_WhenPasswordIsEmpty()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdatePassword(string.Empty, "admin");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("password");
        }

        [TestMethod]
        public void UpdatePassword_ShouldThrowArgumentException_WhenPasswordShorterThanSevenSymbols()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdatePassword("qwe", "admin");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("password");
        }

        [TestMethod]
        public void UpdatePassword_ShouldThrowArgumentException_WhenPasswordHasWhitespaceSymbol()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdatePassword("qwe qwe", "admin");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("password");
        }

        [TestMethod]
        public void UpdatePassword_ShouldUpdatePasswordHash()
        {
            var user = UserObjectMother.Create();
            const string password = "easyGenerAtoR123!";

            user.UpdatePassword(password, "admin");

            user.PasswordHash.Should().Be(Cryptography.GetHash(password));
        }

        [TestMethod]
        public void UpdatePassword_ShouldUpdateMoidifiedBy()
        {
            const string modifiedBy = "admin";
            var user = UserObjectMother.Create();
            user.UpdatePassword("Easy123!", modifiedBy);

            user.ModifiedBy.Should().Be(modifiedBy);
        }

        [TestMethod]
        public void UpdatePassword_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            const string modifiedBy = "admin";
            var user = UserObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            user.UpdatePassword("Easy123!", modifiedBy);

            user.ModifiedOn.Should().Be(dateTime);
        }

        #endregion

        #region UpdateFirstName

        [TestMethod]
        public void UpdateFirstName_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdateFirstName("test", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateFirstName_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdateFirstName("test", String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateFirstName_ShouldThrowArgumentNullException_WhenFirstNameIsNull()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdateFirstName(null, "aaa");

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("firstName");
        }

        [TestMethod]
        public void UpdateFirstName_ShouldThrowArgumentNullException_WhenFirstNameIsEmpty()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdateFirstName("", "aaa");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("firstName");
        }

        [TestMethod]
        public void UpdateFirstName_ShouldSetFirstName()
        {
            var user = UserObjectMother.Create();

            user.UpdateFirstName("firstName", "someUser");

            user.FirstName.Should().Be("firstName");
            user.ModifiedBy.Should().Be("someUser");
        }

        [TestMethod]
        public void UpdateFirstName_ShouldUpdateMoidifiedBy()
        {
            const string modifiedBy = "admin";
            var user = UserObjectMother.Create();
            user.UpdateFirstName("aaa", modifiedBy);

            user.ModifiedBy.Should().Be(modifiedBy);
        }

        [TestMethod]
        public void UpdateFirstName_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            const string modifiedBy = "admin";
            var user = UserObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            user.UpdateFirstName("aaa", modifiedBy);

            user.ModifiedOn.Should().Be(dateTime);
        }

        #endregion

        #region UpdateLastName

        [TestMethod]
        public void UpdateLastName_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdateLastName("test", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateLastName_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdateLastName("test", String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateFirstName_ShouldThrowArgumentNullException_WhenLastNameIsNull()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdateLastName(null, "aaa");

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("lastName");
        }

        [TestMethod]
        public void UpdateFirstName_ShouldThrowArgumentNullException_WhenLastNameIsEmpty()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdateLastName("", "aaa");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("lastName");
        }

        [TestMethod]
        public void UpdateLastName_ShouldSetLastName()
        {
            //Arrange
            var user = UserObjectMother.Create();

            //Act
            user.UpdateLastName("lastName", "someUser");

            //Assert
            user.LastName.Should().Be("lastName");
            user.ModifiedBy.Should().Be("someUser");
        }

        [TestMethod]
        public void UpdateLastName_ShouldUpdateMoidifiedBy()
        {
            const string modifiedBy = "admin";
            var user = UserObjectMother.Create();
            user.UpdateLastName("aaa", modifiedBy);

            user.ModifiedBy.Should().Be(modifiedBy);
        }

        [TestMethod]
        public void UpdateLastName_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            const string modifiedBy = "admin";
            var user = UserObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            user.UpdateLastName("aaa", modifiedBy);

            user.ModifiedOn.Should().Be(dateTime);
        }

        #endregion

        #region UpdatePhone

        [TestMethod]
        public void UpdatePhone_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdatePhone("123456", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdatePhone_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdatePhone("123456", String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateFirstName_ShouldThrowArgumentNullException_WhenPhoneIsNull()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdatePhone(null, "aaa");

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("phone");
        }

        [TestMethod]
        public void UpdateFirstName_ShouldThrowArgumentNullException_WhenPhoneIsEmpty()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdatePhone("", "aaa");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("phone");
        }

        [TestMethod]
        public void UpdatePhone_ShouldSetPhone()
        {
            //Arrange
            var user = UserObjectMother.Create();

            //Act
            user.UpdatePhone("123456", "someUser");

            //Assert
            user.Phone.Should().Be("123456");
            user.ModifiedBy.Should().Be("someUser");
        }

        [TestMethod]
        public void UpdatePhone_ShouldUpdateMoidifiedBy()
        {
            const string modifiedBy = "admin";
            var user = UserObjectMother.Create();
            user.UpdatePhone("aaa", modifiedBy);

            user.ModifiedBy.Should().Be(modifiedBy);
        }

        [TestMethod]
        public void UpdatePhone_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            const string modifiedBy = "admin";
            var user = UserObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            user.UpdatePhone("aaa", modifiedBy);

            user.ModifiedOn.Should().Be(dateTime);
        }

        #endregion

        #region UpdateOrganization

        [TestMethod]
        public void UpdateOrganization_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdateOrganization("test", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateOrganization_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdateOrganization("test", String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateFirstName_ShouldThrowArgumentNullException_WhenOrganizationIsNull()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdateOrganization(null, "aaa");

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("organization");
        }

        [TestMethod]
        public void UpdateFirstName_ShouldThrowArgumentNullException_WhenOrganizationIsEmpty()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdateOrganization("", "aaa");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("organization");
        }

        [TestMethod]
        public void UpdateOrganization_ShouldSetOrganization()
        {
            //Arrange
            var user = UserObjectMother.Create();

            //Act
            user.UpdateOrganization("organization", "someUser");

            //Assert
            user.Organization.Should().Be("organization");
            user.ModifiedBy.Should().Be("someUser");
        }

        [TestMethod]
        public void UpdateOrganization_ShouldUpdateMoidifiedBy()
        {
            const string modifiedBy = "admin";
            var user = UserObjectMother.Create();
            user.UpdateOrganization("aaa", modifiedBy);

            user.ModifiedBy.Should().Be(modifiedBy);
        }

        [TestMethod]
        public void UpdateOrganization_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            const string modifiedBy = "admin";
            var user = UserObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            user.UpdateOrganization("aaa", modifiedBy);

            user.ModifiedOn.Should().Be(dateTime);
        }

        #endregion

        #region UpdateCountry

        [TestMethod]
        public void UpdateCountry_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdateCountry("UA", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateCountry_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdateCountry("UA", String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateFirstName_ShouldThrowArgumentNullException_WhenCountryIsNull()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdateCountry(null, "aaa");

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("country");
        }

        [TestMethod]
        public void UpdateFirstName_ShouldThrowArgumentNullException_WhenCountryIsEmpty()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdateCountry("", "aaa");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("country");
        }

        [TestMethod]
        public void UpdateCountry_ShouldSetCountry()
        {
            //Arrange
            var user = UserObjectMother.Create();
            //Act
            user.UpdateCountry("Ukraine", "someUser");

            //Assert
            user.Country.Should().Be("Ukraine");
            user.ModifiedBy.Should().Be("someUser");
        }

        [TestMethod]
        public void UpdateCountry_ShouldUpdateMoidifiedBy()
        {
            const string modifiedBy = "admin";
            var user = UserObjectMother.Create();
            user.UpdateCountry("aaa", modifiedBy);

            user.ModifiedBy.Should().Be(modifiedBy);
        }

        [TestMethod]
        public void UpdateCountry_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            const string modifiedBy = "admin";
            var user = UserObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            user.UpdateCountry("aaa", modifiedBy);

            user.ModifiedOn.Should().Be(dateTime);
        }

        #endregion

        #region UpdateLastReadReleaseNote

        [TestMethod]
        public void UpdateLastReadReleaseNote_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdateLastReadReleaseNote("UA", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateLastReadReleaseNote_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdateLastReadReleaseNote("UA", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void UpdateLastReadReleaseNote_ShouldThrowArgumentNullException_WhenLastReadReleaseNoteIsNull()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdateLastReadReleaseNote(null, "aaa");

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("lastReadReleaseNote");
        }

        [TestMethod]
        public void UpdateLastReadReleaseNote_ShouldThrowArgumentException_WhenLastReadReleaseNoteIsEmpty()
        {
            var user = UserObjectMother.Create();

            Action action = () => user.UpdateLastReadReleaseNote(string.Empty, "aaa");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("lastReadReleaseNote");
        }

        [TestMethod]
        public void UpdateLastReadReleaseNote_ShouldSetCountry()
        {
            //Arrange
            var user = UserObjectMother.Create();

            //Act
            user.UpdateLastReadReleaseNote("Ukraine", "someUser");

            //Assert
            user.Country.Should().Be("Ukraine");
            user.ModifiedBy.Should().Be("someUser");
        }

        [TestMethod]
        public void UpdateLastReadReleaseNote_ShouldUpdateMoidifiedBy()
        {
            const string modifiedBy = "admin";
            var user = UserObjectMother.Create();
            user.UpdateLastReadReleaseNote("aaa", modifiedBy);

            user.ModifiedBy.Should().Be(modifiedBy);
        }

        [TestMethod]
        public void UpdateLastReadReleaseNote_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            const string modifiedBy = "admin";
            var user = UserObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            user.UpdateLastReadReleaseNote("aaa", modifiedBy);

            user.ModifiedOn.Should().Be(dateTime);
        }

        #endregion

        #region UpgradePlanToStarter

        [TestMethod]
        public void UpgradePlanToStarter_ShouldThrowArgumentException_WhenExpirationTimeLessThanSqlMinDate()
        {
            //Arrange
            var user = UserObjectMother.Create();
            var minDate = new DateTime(2000, 1, 1);
            DateTimeWrapper.MinValue = () => minDate;

            //Act
            Action action = () => user.UpgradePlanToStarter(new DateTime(1999, 12, 30));

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("expirationDate");
        }

        [TestMethod]
        public void UpgradePlanToStarter_ShouldSetAccessTypeToStarter()
        {
            //Arrange
            var user = UserObjectMother.Create();

            //Act
            user.UpgradePlanToStarter(DateTime.Now);

            //Assert
            user.AccessType.Should().Be(AccessType.Starter);
        }

        [TestMethod]
        public void UpgradePlanToStarter_ShouldSetExpirationDate()
        {
            //Arrange
            var user = UserObjectMother.Create();
            var expirationDate = DateTime.MaxValue;

            //Act
            user.UpgradePlanToStarter(expirationDate);

            //Assert
            user.ExpirationDate.Should().Be(expirationDate);
        }

        [TestMethod]
        public void UpgradePlanToStarter_ShouldAddUserUpgradedToStarter()
        {
            //Arrange
            var user = UserObjectMother.Create();

            //Act
            user.UpgradePlanToStarter(DateTime.Now);

            //Assert
            user.Events.Should().ContainSingle(e => e.GetType() == typeof(UserUpgradedToStarter));
        }

        #endregion

        #region UpgradePlanToPlus

        [TestMethod]
        public void UpgradePlanToPlus_ShouldThrowArgumentException_WhenExpirationTimeLessThanSqlMinDate()
        {
            //Arrange
            var user = UserObjectMother.Create();
            var minDate = new DateTime(2000, 1, 1);
            DateTimeWrapper.MinValue = () => minDate;

            //Act
            Action action = () => user.UpgradePlanToPlus(new DateTime(1999, 12, 30));

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("expirationDate");
        }

        [TestMethod]
        public void UpgradePlanToPlus_ShouldSetAccessTypeToPlus()
        {
            //Arrange
            var user = UserObjectMother.Create();

            //Act
            user.UpgradePlanToPlus(DateTime.Now);

            //Assert
            user.AccessType.Should().Be(AccessType.Plus);
        }

        [TestMethod]
        public void UpgradePlanToPlus_ShouldSetExpirationDate()
        {
            //Arrange
            var user = UserObjectMother.Create();
            var expirationDate = DateTime.MaxValue;

            //Act
            user.UpgradePlanToPlus(expirationDate);

            //Assert
            user.ExpirationDate.Should().Be(expirationDate);
        }

        [TestMethod]
        public void UpgradePlanToPlus_ShouldAddUserUpgradedToPlus()
        {
            //Arrange
            var user = UserObjectMother.Create();

            //Act
            user.UpgradePlanToPlus(DateTime.Now);

            //Assert
            user.Events.Should().ContainSingle(e => e.GetType() == typeof(UserUpgradedToPlus));
        }

        #endregion

        #region UpgradePlanToAcademy

        [TestMethod]
        public void UpgradePlanToAcademy_ShouldThrowArgumentException_WhenExpirationTimeLessThanSqlMinDate()
        {
            //Arrange
            var user = UserObjectMother.Create();
            var minDate = new DateTime(2000, 1, 1);
            DateTimeWrapper.MinValue = () => minDate;

            //Act
            Action action = () => user.UpgradePlanToAcademy(new DateTime(1999, 12, 30));

            //Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("expirationDate");
        }

        [TestMethod]
        public void UpgradePlanToAcademy_ShouldSetAccessTypeToPlus()
        {
            //Arrange
            var user = UserObjectMother.Create();

            //Act
            user.UpgradePlanToAcademy(DateTime.Now);

            //Assert
            user.AccessType.Should().Be(AccessType.Academy);
        }

        [TestMethod]
        public void UpgradePlanToAcademy_ShouldSetExpirationDate()
        {
            //Arrange
            var user = UserObjectMother.Create();
            var expirationDate = DateTime.MaxValue;

            //Act
            user.UpgradePlanToAcademy(expirationDate);

            //Assert
            user.ExpirationDate.Should().Be(expirationDate);
        }

        [TestMethod]
        public void UpgradePlanToAcademy_ShouldAddUserUpgradedToPlus()
        {
            //Arrange
            var user = UserObjectMother.Create();

            //Act
            user.UpgradePlanToAcademy(DateTime.Now);

            //Assert
            user.Events.Should().ContainSingle(e => e.GetType() == typeof(UserUpgradedToAcademy));
        }

        #endregion

        #region DowngradePlanToFree

        [TestMethod]
        public void DowngradePlanToFree_ShouldSetAccessTypeToFree()
        {
            //Arrange
            var user = UserObjectMother.Create();

            //Act
            user.DowngradePlanToFree();

            //Assert
            user.AccessType.Should().Be(AccessType.Free);
        }

        [TestMethod]
        public void DowngradePlanToFree_ShouldResetExpirationDateToNull()
        {
            //Arrange
            var user = UserObjectMother.Create();

            //Act
            user.DowngradePlanToFree();

            //Assert
            user.ExpirationDate.Should().Be(null);
        }

        [TestMethod]
        public void DowngradePlanToFree_ShouldAddUserDowngradedEvent()
        {
            //Arrange
            var user = UserObjectMother.Create();

            //Act
            user.DowngradePlanToFree();

            //Assert
            user.Events.Should().ContainSingle(e => e.GetType() == typeof(UserDowngraded));
        }


        #endregion

        #region GetLtiUserInfo

        public void GetLtiUserInfo_ShouldThrowArgumentNullExceptionIfConsumerToolIsNull()
        {
            var user = new User();
            Action action = () => user.GetLtiUserInfo(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("consumerTool");
        }

        public void GetLtiUserInfo_ShouldReturnProperLtiInfoForSpecifiedConsumerTool()
        {
            var user = new User();
            var consumerTool = new ConsumerTool();
            var ltiUserInfo = new LtiUserInfo("id", consumerTool);

            user.LtiUserInfoes.Add(ltiUserInfo);
            user.LtiUserInfoes.Add(new LtiUserInfo("id2", new ConsumerTool()));

            user.GetLtiUserInfo(consumerTool).Should().Be(ltiUserInfo);
            user.GetLtiUserInfo(new ConsumerTool()).Should().BeNull();
        }

        #endregion

        #region UpdateLtiUserInfo

        public void AddLtiUserInfo_ShouldAddLtiUserInfo()
        {
            var user = new User();
            var consumerTool = new ConsumerTool();
            var id = "id";

            user.AddLtiUserInfo(id, consumerTool);
            user.LtiUserInfoes.Count.Should().Be(1);

            user.LtiUserInfoes.ElementAt(0).ConsumerTool.Should().Be(consumerTool);
            user.LtiUserInfoes.ElementAt(0).LtiUserId.Should().Be(id);
        }

        public void AddLtiUserInfo_ShouldNotAddLtiUserInfoIfAlreadyExists()
        {
            var user = new User();
            var consumerTool = new ConsumerTool();

            user.AddLtiUserInfo("id", consumerTool);
            user.AddLtiUserInfo("id", consumerTool);

            user.LtiUserInfoes.Count.Should().Be(1);
        }

        #endregion
    }
}
