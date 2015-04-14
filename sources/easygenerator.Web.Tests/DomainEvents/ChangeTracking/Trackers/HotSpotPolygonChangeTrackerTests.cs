﻿using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents.HotSpotEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.DomainEvents.ChangeTracking.Events;
using easygenerator.Web.DomainEvents.ChangeTracking.Trackers;
using easygenerator.Web.Tests.Utils;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.DomainEvents.ChangeTracking.Trackers
{
    [TestClass]
    public class HotSpotPolygonChangeTrackerTests
    {
        private HotSpotPolygonChangeTracker _tracker;
        private IDomainEventPublisher _publisher;

        [TestInitialize]
        public void Initialize()
        {
            _publisher = Substitute.For<IDomainEventPublisher>();
            _tracker = new HotSpotPolygonChangeTracker(_publisher);
        }

        #region Handlers

        [TestMethod]
        public void Handler_HotSpotPolygonUpdatedEvent_Should_Publish_AnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new HotSpotPolygonUpdatedEvent(HotSpotPolygonObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<HotSpotPolygonChangedEvent>();
        }

        [TestMethod]
        public void Handler_HotSpotPolygonCreatedEvent_Should_Publish_AnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new HotSpotPolygonCreatedEvent(HotSpotPolygonObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<HotSpotPolygonChangedEvent>();
        }

        #endregion
    }
}
