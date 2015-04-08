﻿using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.AnswerEvents;
using easygenerator.DomainModel.Events.LearningContentEvents;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.DomainModel.Events.QuestionEvents.DragAndDropEvents;
using easygenerator.DomainModel.Events.QuestionEvents.HotSpotEvents;
using easygenerator.DomainModel.Events.QuestionEvents.SingleSelectImageEvents;
using easygenerator.DomainModel.Events.QuestionEvents.TextMatchingEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.DomainEvents.ChangeTracking.Events;
using easygenerator.Web.DomainEvents.ChangeTracking.Trackers;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Collections.ObjectModel;
using System.Linq;

namespace easygenerator.Web.Tests.DomainEvents.ChangeTracking.Trackers
{
    [TestClass]
    public class QuestionChangeTrackerTests
    {
        private QuestionChangeTracker _tracker;
        private IDomainEventPublisher _publisher;

        [TestInitialize]
        public void Initialize()
        {
            _publisher = Substitute.For<IDomainEventPublisher>();
            _tracker = new QuestionChangeTracker(_publisher);
        }

        #region Question event handlers

        [TestMethod]
        public void Handler_FillInTheBlankUpdated_Should_Publish_QuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new FillInTheBlankUpdatedEvent(FillInTheBlanksObjectMother.Create(), new Collection<BlankAnswer>()));

            //Assert
            ShouldPublishQuestionChangedEvent();
        }

        [TestMethod]
        public void Handler_LearningContentsReordered_Should_Publish_QuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new LearningContentsReorderedEvent(FillInTheBlanksObjectMother.Create()));

            //Assert
            ShouldPublishQuestionChangedEvent();
        }

        [TestMethod]
        public void Handler_QuestionContentUpdated_Should_Publish_QuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionContentUpdatedEvent(FillInTheBlanksObjectMother.Create()));

            //Assert
            ShouldPublishQuestionChangedEvent();
        }

        [TestMethod]
        public void Handler_QuestionBackgroundChanged_Should_Publish_QuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionBackgroundChangedEvent(DragAndDropTextObjectMother.Create(), "bg.com"));

            //Assert
            ShouldPublishQuestionChangedEvent();
        }

        [TestMethod]
        public void Handler_QuestionIncorrectFeedbackUpdated_Should_Publish_QuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionIncorrectFeedbackUpdatedEvent(DragAndDropTextObjectMother.Create()));

            //Assert
            ShouldPublishQuestionChangedEvent();
        }

        [TestMethod]
        public void Handler_QuestionCorrectFeedbackUpdated_Should_Publish_QuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionCorrectFeedbackUpdatedEvent(DragAndDropTextObjectMother.Create()));

            //Assert
            ShouldPublishQuestionChangedEvent();
        }

        [TestMethod]
        public void Handler_QuestionCreated_Should_Publish_QuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionCreatedEvent(DragAndDropTextObjectMother.Create()));

            //Assert
            ShouldPublishQuestionChangedEvent();
        }

        [TestMethod]
        public void Handler_QuestionTitleUpdatedEvent_Should_Publish_QuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionTitleUpdatedEvent(DragAndDropTextObjectMother.Create()));

            //Assert
            ShouldPublishQuestionChangedEvent();
        }

        [TestMethod]
        public void Handler_AnswerDeletedEvent_Should_Publish_QuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new AnswerDeletedEvent(SingleSelectTextObjectMother.Create(), AnswerObjectMother.Create()));

            //Assert
            ShouldPublishQuestionChangedEvent();
        }

        [TestMethod]
        public void Handler_LearningContentDeletedEvent_Should_Publish_QuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new LearningContentDeletedEvent(SingleSelectTextObjectMother.Create(), LearningContentObjectMother.Create()));

            //Assert
            ShouldPublishQuestionChangedEvent();
        }

        [TestMethod]
        public void Handler_HotSpotPolygonDeletedEvent_Should_Publish_QuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new HotSpotPolygonDeletedEvent(SingleSelectTextObjectMother.Create(), HotSpotPolygonObjectMother.Create()));

            //Assert
            ShouldPublishQuestionChangedEvent();
        }

        [TestMethod]
        public void Handler_DropspotPolygonDeletedEvent_Should_Publish_QuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new DropspotDeletedEvent(SingleSelectTextObjectMother.Create(), DropspotObjectMother.Create()));

            //Assert
            ShouldPublishQuestionChangedEvent();
        }

        [TestMethod]
        public void Handler_HotSpotIsMultipleChanged_Should_Publish_QuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new HotSpotIsMultipleChangedEvent(SingleSelectTextObjectMother.Create(), false));

            //Assert
            ShouldPublishQuestionChangedEvent();
        }

        [TestMethod]
        public void Handler_TextMatchingAnswerDeleted_Should_Publish_QuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new TextMatchingAnswerDeletedEvent(TextMatchingObjectMother.Create(), TextMatchingAnswerObjectMother.Create()));

            //Assert
            ShouldPublishQuestionChangedEvent();
        }

        [TestMethod]
        public void Handler_SingleSelectImageAnswerDeleted_Should_Publish_QuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new SingleSelectImageAnswerDeletedEvent(SingleSelectImageAnswerObjectMother.Create(), SingleSelectImageObjectMother.Create()));

            //Assert
            ShouldPublishQuestionChangedEvent();
        }

        #endregion

        private void ShouldPublishQuestionChangedEvent()
        {
            var calls = _publisher.ReceivedCalls();
            calls.Count().Should().Be(1);
            calls.First().GetArguments()[0].Should().BeOfType<QuestionChangedEvent>();
        }
    }
}
