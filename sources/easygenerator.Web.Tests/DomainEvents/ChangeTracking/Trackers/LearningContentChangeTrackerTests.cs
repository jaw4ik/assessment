﻿using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.LearningContentEvents;
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
    public class LearningContentChangeTrackerTests
    {
        private LearningContentChangeTracker _tracker;
        private IDomainEventPublisher _publisher;

        [TestInitialize]
        public void Initialize()
        {
            _publisher = Substitute.For<IDomainEventPublisher>();
            _tracker = new LearningContentChangeTracker(_publisher);
        }

        #region Handlers

        [TestMethod]
        public void Handler_LearningContentCreated_Should_Publish_LearningContentChangedEvent()
        {
            //Act
            _tracker.Handle(new LearningContentCreatedEvent(LearningContentObjectMother.Create()));

            //Assert
            ShouldPublishLearningContentChangedEvent();
        }

        [TestMethod]
        public void Handler_LearningContentUpdated_Should_Publish_LearningContentChangedEvent()
        {
            //Act
            _tracker.Handle(new LearningContentUpdatedEvent(LearningContentObjectMother.Create()));

            //Assert
            ShouldPublishLearningContentChangedEvent();
        }

        #endregion

        private void ShouldPublishLearningContentChangedEvent()
        {
            var calls = _publisher.ReceivedCalls();
            calls.Count().Should().Be(1);
            calls.First().GetArguments()[0].Should().BeOfType<LearningContentChangedEvent>();
        }
    }
}
