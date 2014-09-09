﻿using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events.QuestionEvents.DragAnsDropEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.DomainModel.Tests.Entities.Questions
{
    [TestClass]
    public class DragAndDropTextTests
    {
        private const string ModifiedBy = "easygenerator@easygenerator.com";
        private const string CreatedBy = "easygenerator2@easygenerator.com";

        #region Constructor

        [TestMethod]
        public void DragAndDropText_ShouldThrowArgumentNullException_WhenTitleIsNull()
        {
            Action action = () => DragAndDropTextObjectMother.CreateWithTitle(null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void DragAndDropText_ShouldThrowArgumentException_WhenTitleIsEmpty()
        {
            Action action = () => DragAndDropTextObjectMother.CreateWithTitle(String.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void DragAndDropText_ShouldThrowArgumentOutOfRangeException_WhenTitleIsLongerThan255()
        {
            Action action = () => DragAndDropTextObjectMother.CreateWithTitle(new string('*', 256));

            action.ShouldThrow<ArgumentOutOfRangeException>().And.ParamName.Should().Be("title");
        }

        [TestMethod]
        public void DragAndDropText_ShouldCreateQuestionInstance()
        {
            const string title = "title";
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var question = DragAndDropTextObjectMother.Create(title, CreatedBy);

            question.Id.Should().NotBeEmpty();
            question.Title.Should().Be(title);
            question.Background.Should().BeNull();
            question.Dropspots.Should().BeEmpty();
            question.LearningContents.Should().BeEmpty();
            question.CreatedOn.Should().Be(DateTime.MaxValue);
            question.ModifiedOn.Should().Be(DateTime.MaxValue);
            question.CreatedBy.Should().Be(CreatedBy);
            question.ModifiedBy.Should().Be(CreatedBy);
        }

        #endregion

        #region Change background

        [TestMethod]
        public void ChangeBackground_ShouldThrowArgumentNullException_WhenBackgroundIsNull()
        {
            var question = DragAndDropTextObjectMother.Create();

            Action action = () => question.ChangeBackground(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("background");
        }

        [TestMethod]
        public void ChangeBackground_ShouldThrowArgumentNullException_WhenBackgroundIsEmpty()
        {
            var question = DragAndDropTextObjectMother.Create();

            Action action = () => question.ChangeBackground(String.Empty, ModifiedBy);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("background");
        }

        [TestMethod]
        public void ChangeBackground_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = DragAndDropTextObjectMother.Create();

            Action action = () => question.ChangeBackground("background", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void ChangeBackground_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = DragAndDropTextObjectMother.Create();

            Action action = () => question.ChangeBackground("background", string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void ChangeBackground_ShouldChangeBackground()
        {
            const string background = "background";
            var question = DragAndDropTextObjectMother.Create();

            question.ChangeBackground(background, ModifiedBy);

            question.Background.Should().Be(background);
        }

        [TestMethod]
        public void ChangeBackground_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = DragAndDropTextObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.ChangeBackground("background", ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void ChangeBackground_ShouldUpdateMoidifiedBy()
        {
            var question = DragAndDropTextObjectMother.Create();
            const string user = "user";

            question.ChangeBackground("background", user);

            question.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void ChangeBackground_ShouldAddDropspotPositionChangedEvent()
        {
            var question = DragAndDropTextObjectMother.Create();

            question.ChangeBackground("background", "username");

            question.Events.Should().HaveCount(1).And.OnlyContain(e => e.GetType() == typeof(BackgroundChangedEvent));
        }

        #endregion

        #region Add dropspot

        [TestMethod]
        public void AddDropspot_ShouldThrowArgumentNullException_WhenDropspotIsNull()
        {
            var question = DragAndDropTextObjectMother.Create();

            Action action = () => question.AddDropspot(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("dropspot");
        }

        [TestMethod]
        public void AddDropspot_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = DragAndDropTextObjectMother.Create();
            var dropspot = DropspotObjectMother.Create();

            Action action = () => question.AddDropspot(dropspot, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddDropspot_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = DragAndDropTextObjectMother.Create();
            var dropspot = DropspotObjectMother.Create();

            Action action = () => question.AddDropspot(dropspot, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void AddDropspot_ShouldAddDropspot()
        {
            var question = DragAndDropTextObjectMother.Create();
            var dropspot = DropspotObjectMother.Create();

            question.AddDropspot(dropspot, ModifiedBy);

            question.DropspotsCollection.Should().NotBeNull().And.HaveCount(1).And.Contain(dropspot);
        }

        [TestMethod]
        public void AddDropspot_ShouldSetQuestionToDropspot()
        {
            var question = DragAndDropTextObjectMother.Create();
            var dropspot = DropspotObjectMother.Create();

            question.AddDropspot(dropspot, ModifiedBy);

            dropspot.Question.Should().Be(question);
        }

        [TestMethod]
        public void AddDropspot_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = DragAndDropTextObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.AddDropspot(DropspotObjectMother.Create(), ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void AddDropspot_ShouldUpdateMoidifiedBy()
        {
            var question = DragAndDropTextObjectMother.Create();
            var dropspot = DropspotObjectMother.Create();
            const string user = "user";

            question.AddDropspot(dropspot, user);

            question.ModifiedBy.Should().Be(user);
        }


        [TestMethod]
        public void AddDropspot_ShouldAddCourseTitleUpdatedEvent()
        {
            var question = DragAndDropTextObjectMother.Create();
            var dropspot = DropspotObjectMother.Create();

            question.AddDropspot(dropspot, "username");

            question.Events.Should().HaveCount(1).And.OnlyContain(e => e.GetType() == typeof(DropspotCreatedEvent));
        }

        #endregion

        #region Remove dropspot

        [TestMethod]
        public void RemoveDropspot_ShouldThrowArgumentNullException_WhenDropspotIsNull()
        {
            var question = DragAndDropTextObjectMother.Create();

            Action action = () => question.RemoveDropspot(null, ModifiedBy);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("dropspot");
        }

        [TestMethod]
        public void RemoveDropspot_ShouldThrowArgumentNullException_WhenModifiedByIsNull()
        {
            var question = DragAndDropTextObjectMother.Create();
            var dropspot = DropspotObjectMother.Create();

            Action action = () => question.RemoveDropspot(dropspot, null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveDropspot_ShouldThrowArgumentException_WhenModifiedByIsEmpty()
        {
            var question = DragAndDropTextObjectMother.Create();
            var dropspot = DropspotObjectMother.Create();

            Action action = () => question.RemoveDropspot(dropspot, string.Empty);

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("modifiedBy");
        }

        [TestMethod]
        public void RemoveDropspot_ShouldRemoveDropspot()
        {
            var question = DragAndDropTextObjectMother.Create();
            var dropspot = DropspotObjectMother.Create();
            question.DropspotsCollection = new Collection<Dropspot>() { dropspot };

            question.RemoveDropspot(dropspot, ModifiedBy);
            question.DropspotsCollection.Should().BeEmpty();
        }

        [TestMethod]
        public void RemoveDropspot_ShouldUnsetQuestionFromDropspot()
        {
            var question = DragAndDropTextObjectMother.Create();
            var dropspot = DropspotObjectMother.Create();
            dropspot.Question = question;

            question.RemoveDropspot(dropspot, ModifiedBy);

            dropspot.Question.Should().BeNull();
        }

        [TestMethod]
        public void RemoveDropspot_ShouldUpdateModificationDate()
        {
            DateTimeWrapper.Now = () => DateTime.Now;
            var question = DragAndDropTextObjectMother.Create();

            var dateTime = DateTime.Now.AddDays(2);
            DateTimeWrapper.Now = () => dateTime;

            question.RemoveDropspot(DropspotObjectMother.Create(), ModifiedBy);

            question.ModifiedOn.Should().Be(dateTime);
        }

        [TestMethod]
        public void RemoveDropspot_ShouldUpdateModifiedBy()
        {
            var question = DragAndDropTextObjectMother.Create();
            var dropspot = DropspotObjectMother.Create();
            const string user = "user";

            question.RemoveDropspot(dropspot, user);

            question.ModifiedBy.Should().Be(user);
        }

        [TestMethod]
        public void RemoveDropspot_ShouldAddCourseTitleUpdatedEvent()
        {
            var question = DragAndDropTextObjectMother.Create();
            var dropspot = DropspotObjectMother.Create();

            question.RemoveDropspot(dropspot, "username");

            question.Events.Should().HaveCount(1).And.OnlyContain(e => e.GetType() == typeof(DropspotDeletedEvent));
        }

        #endregion
    }
}
