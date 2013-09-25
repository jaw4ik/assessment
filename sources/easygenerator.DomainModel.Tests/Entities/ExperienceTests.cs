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

            var experience = ExperienceObjectMother.Create(title);

            experience.Id.Should().NotBeEmpty();
            experience.Title.Should().Be(title);
            experience.CreatedOn.Should().Be(DateTime.MaxValue);
            experience.ModifiedOn.Should().Be(DateTime.MaxValue);
            experience.RelatedObjectives.Should().BeEmpty();
        }

        #endregion

        #region RelateObjective

        [TestMethod]
        public void RelateObjective_ShouldThrowNullArgumentException_WhenObjectiveIsNull()
        {
            //Arrange
            var experience = ExperienceObjectMother.Create();

            //Act
            Action action = () => experience.RelateObjective(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("objective");
        }

        [TestMethod]
        public void RelateObjective_ShouldUpdateModifiedOnDate()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();
            var experience = ExperienceObjectMother.Create();
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            //Act
            experience.RelateObjective(objective);

            //Assert
            experience.ModifiedOn.Should().Be(DateTime.MaxValue);
        }

        [TestMethod]
        public void RelateObjective_ShouldRelateObjectiveToExperience()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();
            var experience = ExperienceObjectMother.Create();

            //Act
            experience.RelateObjective(objective);

            //Assert
            experience.RelatedObjectives.Should().Contain(objective);
        }

        #endregion

        #region UnrelateObjective

        [TestMethod]
        public void UnrelateObjective_ShouldThrowNullArgumentException_WhenObjectiveIsNull()
        {
            //Arrange
            var experience = ExperienceObjectMother.Create();

            //Act
            Action action = () => experience.UnrelateObjective(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("objective");
        }

        [TestMethod]
        public void UnrelateObjective_ShouldUpdateModifiedOnDate()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();
            var experience = ExperienceObjectMother.Create();
            experience.RelateObjective(objective);
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            //Act
            experience.UnrelateObjective(objective);

            //Assert
            experience.ModifiedOn.Should().Be(DateTime.MaxValue);
        }

        [TestMethod]
        public void UnrelateObjective_ShouldUnrelateObjectiveFromExperience()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();
            var experience = ExperienceObjectMother.Create();
            experience.RelateObjective(objective);

            //Act
            experience.UnrelateObjective(objective);

            //Assert
            experience.RelatedObjectives.Should().NotContain(objective);
        }

        #endregion
    }
}
