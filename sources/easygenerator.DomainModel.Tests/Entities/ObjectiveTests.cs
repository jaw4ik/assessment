using System;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Tests;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class ObjectiveTests
    {
        #region Constructor

        [TestMethod]
        public void Objective_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            Action action = () => ObjectiveObjectMother.CreateWithTitle(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Objective_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            Action action = () => ObjectiveObjectMother.CreateWithTitle(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Objective_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            Action action = () => ObjectiveObjectMother.CreateWithTitle(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Objective_ShouldCreateObjectiveInstance()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var objective = ObjectiveObjectMother.Create(title);

            objective.Id.Should().NotBeEmpty();
            objective.Title.Should().Be(title);
            objective.CreatedOn.Should().Be(DateTime.MaxValue);
            objective.ModifiedOn.Should().Be(DateTime.MaxValue);
        }

        #endregion


    }
}
