using System;
using easygenerator.PublicationServer.Models;
using easygenerator.PublicationServer.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.PublicationServer.Tests.Models
{
    [TestClass]
    public class UserTests
    {
        private string ownerEmail = "ownerEmail";

        [TestInitialize]
        public void Init()
        {
            DateTimeWrapper.Now = () => DateTime.MinValue;
        }

        [TestMethod]
        public void Ctor_ShouldThrowArgumentException_IfEmailIsNull()
        {
            Action action = () => { new User(null, AccessType.Academy); };
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("email");
        }

        [TestMethod]
        public void Ctor_ShouldThrowArgumentException_IfEmailIsEmpty()
        {
            Action action = () => { new User("", AccessType.Academy); };
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("email");
        }

        [TestMethod]
        public void Ctor_ShouldThrowArgumentException_IfEmailIsWhitespace()
        {
            Action action = () => { new User("", AccessType.Academy); };
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("email");
        }

        [TestMethod]
        public void Ctor_ShouldInitInstanceWithCorrectValues()
        {
            var user = new User(ownerEmail, AccessType.Academy);
            user.AccessType.Should().Be(AccessType.Academy);
            user.Email.Should().Be(ownerEmail);
            user.ModifiedOn.Should().Be(DateTimeWrapper.Now());
        }
    }
}
