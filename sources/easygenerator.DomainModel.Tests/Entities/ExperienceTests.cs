using System;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class ExperienceTests
    {
        #region Constructor

        [TestMethod]
        public void Experience_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            Action action = () => ExperienceObjectMother.CreateWithTitle(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Experience_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            Action action = () => ExperienceObjectMother.CreateWithTitle(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Experience_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            Action action = () => ExperienceObjectMother.CreateWithTitle(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void Experience_ShouldCreateObjectiveInstance()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var objective = ExperienceObjectMother.Create(title);

            objective.Id.Should().NotBeEmpty();
            objective.Title.Should().Be(title);
            objective.CreatedOn.Should().Be(DateTime.MaxValue);
            objective.ModifiedOn.Should().Be(DateTime.MaxValue);
        }

        #endregion
    }
}
