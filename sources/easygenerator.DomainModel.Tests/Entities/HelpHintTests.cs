using System;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities
{
    [TestClass]
    public class HelpHintTests
    {
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        #region Constructor

        [TestMethod]
        public void HelpHint_ShoulThrowArgumentNullException_WhenNameIsNull()
        {
            //Arrange
            Action action = () => HelpHintObjectMother.CreateWithName(null);

            //Act & Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("name");
        }

        [TestMethod]
        public void HelpHint_ShoulThrowArgumentException_WhenNameIsEmpty()
        {
            //Arrange
            Action action = () => HelpHintObjectMother.CreateWithName(string.Empty);

            //Act & Assert
            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("name");
        }

        [TestMethod]
        public void HelpHint_ShouldCreateHelpHint()
        {
            //Arrange
            var name = "Some name";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            //Act
            var helpHint = HelpHintObjectMother.Create(name, CreatedBy);

            //Assert
            helpHint.Id.Should().NotBeEmpty();
            helpHint.Name.Should().Be(name);
            helpHint.CreatedOn.Should().Be(DateTime.MaxValue);
            helpHint.ModifiedOn.Should().Be(DateTime.MaxValue);
            helpHint.CreatedBy.Should().Be(CreatedBy);
            helpHint.ModifiedBy.Should().Be(CreatedBy);
        }

        #endregion
    }
}
