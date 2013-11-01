using System;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.DomainModel.Tests.ObjectMothers;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class UserTests
    {
        private const string CreatedBy = "easygenerator2@easygenerator.com";

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
        public void User_ShouldThrowArgumentException_WhenPasswordHasNoDigitSymbol()
        {
            //Arrange
            Action action = () => UserObjectMother.CreateWithPassword("OLOLOLOLO");

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("password");
        }

        [TestMethod]
        public void User_ShouldThrowArgumentException_WhenPasswordHasNoUpperCaseSymbol()
        {
            //Arrange
            Action action = () => UserObjectMother.CreateWithPassword("ololololo1");

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("password");
        }

        [TestMethod]
        public void User_ShouldThrowArgumentException_WhenPasswordHasNoLowerCaseSymbol()
        {
            //Arrange
            Action action = () => UserObjectMother.CreateWithPassword("OLOLOLOLO1");

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
        public void User_ShouldThrowArgumentNullException_WhenFullNameIsNull()
        {
            //Arrange
            Action action = () => UserObjectMother.CreateWithFullName(null);

            //Act & Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("fullName");
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
        public void User_ShouldThrowArgumentNullException_WhenOrganizationIsNull()
        {
            //Arrange
            Action action = () => UserObjectMother.CreateWithOrganization(null);

            //Act & Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("organization");
        }

        [TestMethod]
        public void User_ShouldThrowArgumentNullException_WhenFullNameIsEmpty()
        {
            //Arrange
            Action action = () => UserObjectMother.CreateWithFullName("");

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("fullName");
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
        public void User_ShouldThrowArgumentNullException_WhenOrganizationIsEmpty()
        {
            //Arrange
            Action action = () => UserObjectMother.CreateWithOrganization("");

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("organization");
        }

        [TestMethod]
        public void User_ShouldCreateUser()
        {
            //Arrange
            var email = "easygenerator3@easygenerator.com";
            var password = "Easy123!";
            var fullname = "easygenerator user";
            var phone = "some phone";
            var organization = "Easygenerator";
            var country = "some country";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            //Act
            var user = UserObjectMother.Create(email, password, fullname, phone, organization, country, CreatedBy);

            //Assert
            user.Id.Should().NotBeEmpty();
            user.Email.Should().Be(email);
            user.VerifyPassword(password).Should().BeTrue();
            user.FullName.Should().Be(fullname);
            user.Phone.Should().Be(phone);
            user.Organization.Should().Be(organization);
            user.Country.Should().Be(country);
            user.CreatedOn.Should().Be(DateTime.MaxValue);
            user.ModifiedOn.Should().Be(DateTime.MaxValue);
            user.CreatedBy.Should().Be(CreatedBy);
            user.ModifiedBy.Should().Be(CreatedBy);
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
        public void RecoverPasswordUsingTicket_ShouldThrowArgumentException_WhenPasswordHasNoDigitSymbol()
        {
            var user = UserObjectMother.Create();
            var ticket = PasswordRecoveryTicketObjectMother.Create();

            Action action = () => user.RecoverPasswordUsingTicket(ticket, "abcdefghujklmn");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("password");
        }

        [TestMethod]
        public void RecoverPasswordUsingTicket_ShouldThrowArgumentException_WhenPasswordHasNoUpperCaseSymbol()
        {
            var user = UserObjectMother.Create();
            var ticket = PasswordRecoveryTicketObjectMother.Create();

            Action action = () => user.RecoverPasswordUsingTicket(ticket, "abcdefghujklmn1");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("password");
        }

        [TestMethod]
        public void RecoverPasswordUsingTicket_ShouldThrowArgumentException_WhenPasswordHasNoLowerCaseSymbol()
        {
            var user = UserObjectMother.Create();
            var ticket = PasswordRecoveryTicketObjectMother.Create();

            Action action = () => user.RecoverPasswordUsingTicket(ticket, "ABCDEFGHIJKLMN1");

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
        #endregion
    }
}
