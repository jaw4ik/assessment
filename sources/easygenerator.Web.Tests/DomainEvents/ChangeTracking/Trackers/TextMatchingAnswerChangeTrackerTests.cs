﻿using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents.TextMatchingEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.DomainEvents.ChangeTracking.Events;
using easygenerator.Web.DomainEvents.ChangeTracking.Trackers;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Linq;

namespace easygenerator.Web.Tests.DomainEvents.ChangeTracking.Trackers
{
    [TestClass]
    public class TextMatchingAnswerChangeTrackerTests
    {
        private TextMatchingAnswerChangeTracker _tracker;
        private IDomainEventPublisher _publisher;

        [TestInitialize]
        public void Initialize()
        {
            _publisher = Substitute.For<IDomainEventPublisher>();
            _tracker = new TextMatchingAnswerChangeTracker(_publisher);
        }

        #region Handlers

        [TestMethod]
        public void Handler_TextMatchingAnswerValueChanged_Should_Publish_AnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new TextMatchingAnswerValueChangedEvent(TextMatchingAnswerObjectMother.Create()));

            //Assert
            ShouldPublishAnswerChangedEvent();
        }

        [TestMethod]
        public void Handler_TextMatchingAnswerKeyChangedEvent_Should_Publish_AnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new TextMatchingAnswerKeyChangedEvent(TextMatchingAnswerObjectMother.Create()));

            //Assert
            ShouldPublishAnswerChangedEvent();
        }

        [TestMethod]
        public void Handler_TextMatchingAnswerCreatedEvent_Should_Publish_AnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new TextMatchingAnswerCreatedEvent(TextMatchingAnswerObjectMother.Create()));

            //Assert
            ShouldPublishAnswerChangedEvent();
        }

        #endregion

        private void ShouldPublishAnswerChangedEvent()
        {
            var calls = _publisher.ReceivedCalls();
            calls.Count().Should().Be(1);
            calls.First().GetArguments()[0].Should().BeOfType<TextMatchingAnswerChangedEvent>();
        }
    }
}
