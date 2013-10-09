using System;
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
        public void User_ShouldCreateUser()
        {
            //Arrange
            var email = "easygenerator3@easygenerator.com";
            var password = "Easy123!";
            DateTimeWrapper.Now = () => DateTime.MaxValue;
            
            //Act
            var user = UserObjectMother.Create(email, password, CreatedBy);

            //Assert
            user.Id.Should().NotBeEmpty();
            user.Email.Should().Be(email);
            user.VerifyPassword(password).Should().BeTrue();
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
    }
}
