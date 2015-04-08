using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents.DragAndDropEvents;
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
        public void Handler_DropspotCreatedEvent_Should_Publish_AnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new DropspotCreatedEvent(DropspotObjectMother.Create()));

            //Assert
            ShouldPublishAnswerChangedEvent();
        }

        [TestMethod]
        public void Handler_DropspotPositionChangedEvent_Should_Publish_AnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new DropspotPositionChangedEvent(DropspotObjectMother.Create()));

            //Assert
            ShouldPublishAnswerChangedEvent();
        }

        [TestMethod]
        public void Handler_DropspotTextChangedEvent_Should_Publish_AnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new DropspotTextChangedEvent(DropspotObjectMother.Create()));

            //Assert
            ShouldPublishAnswerChangedEvent();
        }

        #endregion

        private void ShouldPublishAnswerChangedEvent()
        {
            var calls = _publisher.ReceivedCalls();
            calls.Count().Should().Be(1);
            calls.First().GetArguments()[0].Should().BeOfType<DropspotChangedEvent>();
        }
    }
}
