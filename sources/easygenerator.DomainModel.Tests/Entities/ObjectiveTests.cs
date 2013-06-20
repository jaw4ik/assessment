using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Tests;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class ObjectiveTests
    {
        [TestMethod]
        public void Objective_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            AssertException.ExpectArgumentNullException(() => ObjectiveObjectMother.CreateWithTitle(null), "title");
        }

        [TestMethod]
        public void Objective_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            AssertException.ExpectArgumentException(() => ObjectiveObjectMother.CreateWithTitle(String.Empty), "title");
        }

        [TestMethod]
        public void Objective_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            AssertException.ExpectArgumentOutOfRangeException(() => ObjectiveObjectMother.CreateWithTitle(new string('*', 256)), "title");
        }

        [TestMethod]
        public void Objective_ShouldThrowArgumentNullException_WhenCreatedByIsNull()
        {
            AssertException.ExpectArgumentNullException(() => ObjectiveObjectMother.CreateWithCreatedBy(null), "createdBy");
        }

        [TestMethod]
        public void Objective_ShouldThrowArgumentException_WhenCreatedByIsInvalid()
        {
            AssertException.ExpectArgumentException(() => ObjectiveObjectMother.CreateWithCreatedBy(String.Empty), "createdBy");
        }
    }
}
