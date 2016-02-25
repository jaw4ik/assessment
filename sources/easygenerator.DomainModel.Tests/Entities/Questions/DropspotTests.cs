using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Events.QuestionEvents.DragAndDropEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.DomainModel.Tests.Utils;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities.Questions
{
    [TestClass]
    public class DropspotTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        #region Constructor

        [TestMethod]
        public void Dropspot_ShouldThrowArgumentNullException_WhenTextIsNull()
        {
            Action action = () => DropspotObjectMother.CreateWithText(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void Dropspot_ShouldThrowArgumentException_WhenTextIsEmpty()
        {
            Action action = () => DropspotObjectMother.CreateWithText(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void Dropspot_ShouldCreateDropspot()
        {
            const string text = "text";
            const int x = 100;
            const int y = 200;
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var dropspot = DropspotObjectMother.Create(text, x, y, CreatedBy);

            dropspot.Id.Should().NotBeEmpty();
            dropspot.Text.Should().Be(text);
            dropspot.X.Should().Be(x);
            dropspot.Y.Should().Be(y);
            dropspot.CreatedOn.Should().Be(DateTime.MaxValue);
            dropspot.ModifiedOn.Should().Be(DateTime.MaxValue);
            dropspot.CreatedBy.Should().Be(CreatedBy);
            dropspot.ModifiedBy.Should().Be(CreatedBy);
        }

        #endregion

        #region Change Position

        [TestMethod]
        public void ChangePosition_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var dropspot = DropspotObjectMother.Create();

            Action action = () => dropspot.ChangePosition(0, 0, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveDropspot_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var dropspot = DropspotObjectMother.Create();

            Action action = () => dropspot.ChangePosition(0, 0, String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void ChangePosition_ShouldChangePosition()
        {
            //Arrange
            const int x = 100;
            const int y = 200;
            var dropspot = DropspotObjectMother.CreateWithPosition(0, 0);

            //Act
            dropspot.ChangePosition(x, y, ModifiedBy);

            //Assert
            dropspot.X.Should().Be(x);
            dropspot.Y.Should().Be(y);
        }

        [TestMethod]
        public void ChangePosition_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var dropspot = DropspotObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            dropspot.ChangePosition(0, 0, ModifiedBy);

            dropspot.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void ChangePosition_ShouldUpdateModifiedBy()
        {
            var dropspot = DropspotObjectMother.Create();
            const string user = "user";

            dropspot.ChangePosition(0, 0, user);

            dropspot.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void ChangePosition_ShouldAddDropspotPositionChangedEvent()
        {
            var dropspot = DropspotObjectMother.Create();

            dropspot.ChangePosition(0, 0, "username");

            dropspot.ShouldContainSingleEvent<DropspotPositionChangedEvent>();
        }

        #endregion

        #region Change Text

        [TestMethod]
        public void ChangeText_ShouldThrowArgumentNullException_WhenTextIsNull()
        {
            var dropspot = DropspotObjectMother.Create();

            Action action = () => dropspot.ChangeText(null, "modifiedBy");

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void ChangeText_ShouldThrowArgumentException_WhenTextIsEmpty()
        {
            var dropspot = DropspotObjectMother.Create();

            Action action = () => dropspot.ChangeText(String.Empty, "modifiedBy");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("text");
        }

        [TestMethod]
        public void ChangeText_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var dropspot = DropspotObjectMother.Create();

            Action action = () => dropspot.ChangeText("text", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void ChangeText_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var dropspot = DropspotObjectMother.Create();

            Action action = () => dropspot.ChangeText("text", String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void ChangeText_ShouldChangeText()
        {
            //Arrange
            const string text = "changed text";
            var dropspot = DropspotObjectMother.CreateWithText("text");

            //Act
            dropspot.ChangeText(text, "user");

            //Assert
            dropspot.Text.Should().Be(text);
        }

        [TestMethod]
        public void ChangeText_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var dropspot = DropspotObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            dropspot.ChangeText("text", ModifiedBy);

            dropspot.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void ChangeText_ShouldUpdateModifiedBy()
        {
            var dropspot = DropspotObjectMother.Create();
            const string user = "user";

            dropspot.ChangeText("text", user);

            dropspot.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void ChangeText_ShouldAddDropspotTextChangedEvent()
        {
            var dropspot = DropspotObjectMother.Create();

            dropspot.ChangeText("text", "username");

            dropspot.ShouldContainSingleEvent<DropspotTextChangedEvent>();
        }

        #endregion
    }
}
