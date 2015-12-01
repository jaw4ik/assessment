using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.StorageServer.Infrastructure;
using easygenerator.StorageServer.Models;
using easygenerator.StorageServer.Models.Entities;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.StorageServer.Tests.Models
{
    [TestClass]
    public class UserTest
    {
        [TestInitialize]
        public void Initialize()
        {

        }

        #region Constructor

        [TestMethod]
        public void User_ShouldThrowArgumentNullException_WhenEmailIsNull()
        {
            //Arrange
            Action action = () => new User(null);

            //Act & Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("email");
        }


        [TestMethod]
        public void User_ShouldThrowArgumentException_WhenEmailIsEmpty()
        {
            //Arrange
            Action action = () => new User(String.Empty);

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("email");
        }

        [TestMethod]
        public void User_ShouldThrowArgumentException_WhenEmailLengthBiggerthen254Characters()
        {
            //Arrange
            Action action = () => new User("0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789@t.ru");

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("email");
        }

        [TestMethod]
        public void User_ShouldThrowArgumentException_WhenEmailIsInvalid()
        {
            //Arrange
            Action action = () => new User("sdasdasdasdads");

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("email");
        }

        [TestMethod]
        public void User_ShouldSetEmail_WhenEmailIsValid()
        {
            //Arrange
            var email = "test@email.com";
            var user = new User("test@email.com");

            //Act 

            //Assert
            user.Email.Should().Be(email);
        }

        #endregion

        #region ConsumeStorageSpace

        [TestMethod]
        public void ConsumeStorageSpace_ShouldThrowArgumentOutOfRangeException_WhenConsumedSizeIsLessThenZero()
        {
            //Arrange
            var consumedSize = -2000;
            var user = new User("test@email.com");
            //Act
            Action action = () => user.ConsumeStorageSpace(consumedSize);

            //Assert
            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("consumedSize");
        }

        [TestMethod]
        public void ConsumeStorageSpace_ShouldAddConsumedSizeToUsedStorage_WhenConsumedSizeIsGraterThenZero()
        {
            //Arrange
            var consumedSize = 1000;
            var user = new User("test@email.com");
            //Act
            user.ConsumeStorageSpace(consumedSize);

            //Assert
            user.UsedStorageSpace.Should().Be(consumedSize);
        }

        [TestMethod]
        public void ConsumeStorageSpace_ShouldAddConsumedSizeToUsedStorage_WhenConsumedSizeIsZero()
        {
            //Arrange
            var consumedSize = 0;
            var user = new User("test@email.com");
            //Act
            user.ConsumeStorageSpace(consumedSize);

            //Assert
            user.UsedStorageSpace.Should().Be(consumedSize);
        }

        #endregion
    }
}
