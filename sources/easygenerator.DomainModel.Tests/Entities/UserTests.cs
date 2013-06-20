using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Tests;

namespace easygenerator.DomainModel.Tests.Entities
{
    //[TestClass]
    public class UserTests
    {
        [TestMethod]
        public void User_ShouldThrowArgumentNullException_WhenEmailIsNull()
        {
            AssertException.ExpectArgumentNullException(() => UserObjectMother.CreateWithEmail(null), "email");
        }

        [TestMethod]
        public void User_ShouldThrowArgumentException_WhenEmailIsInvalid()
        {
            AssertException.ExpectArgumentException(() => UserObjectMother.CreateWithEmail(String.Empty), "email");
        }

        [TestMethod]
        public void User_ShouldThrowArgumentNullException_WhenPasswordIsNull()
        {
            AssertException.ExpectArgumentNullException(() => UserObjectMother.CreateWithPassword(null), "password");
        }

        [TestMethod]
        public void User_ShouldThrowArgumentException_WhenPasswordIsInvalid()
        {
            AssertException.ExpectArgumentException(() => UserObjectMother.CreateWithPassword(String.Empty), "password");
        }
    }
}
