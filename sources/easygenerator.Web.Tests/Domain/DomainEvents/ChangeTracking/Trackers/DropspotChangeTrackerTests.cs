﻿using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents.DragAndDropEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Domain.DomainEvents.ChangeTracking.Events;
using easygenerator.Web.Domain.DomainEvents.ChangeTracking.Trackers;
using easygenerator.Web.Tests.Utils;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Domain.DomainEvents.ChangeTracking.Trackers
{
    [TestClass]
    public class DropspotChangeTrackerTests
    {
        private DropspotChangeTracker _tracker;
        private IDomainEventPublisher _publisher;

        [TestInitialize]
        public void Initialize()
        {
            _publisher = Substitute.For<IDomainEventPublisher>();
            _tracker = new DropspotChangeTracker(_publisher);
        }

        #region Handlers

        [TestMethod]
        public void Handle_DropspotCreatedEvent_ShouldPublishAnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new DropspotCreatedEvent(DropspotObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<DropspotChangedEvent>();
        }

        [TestMethod]
        public void Handle_DropspotPositionChangedEvent_ShouldPublishAnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new DropspotPositionChangedEvent(DropspotObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<DropspotChangedEvent>();
        }

        [TestMethod]
        public void Handle_DropspotTextChangedEvent_ShouldPublishAnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new DropspotTextChangedEvent(DropspotObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<DropspotChangedEvent>();
        }

        #endregion
    }
}
