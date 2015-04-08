using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents.SingleSelectImageEvents;
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
    public class SingleSelectImageAnswerChangeTrackerTests
    {
        private SingleSelectImageAnswerChangeTracker _tracker;
        private IDomainEventPublisher _publisher;

        [TestInitialize]
        public void Initialize()
        {
            _publisher = Substitute.For<IDomainEventPublisher>();
            _tracker = new SingleSelectImageAnswerChangeTracker(_publisher);
        }

        #region Handlers

        [TestMethod]
        public void Handler_SingleSelectImageCorrectAnswerChangedEvent_Should_Publish_AnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new SingleSelectImageCorrectAnswerChangedEvent(SingleSelectImageAnswerObjectMother.Create()));

            //Assert
            ShouldPublishAnswerChangedEvent();
        }

        [TestMethod]
        public void Handler_SingleSelectImageAnswerImageUpdatedEvent_Should_Publish_AnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new SingleSelectImageAnswerImageUpdatedEvent(SingleSelectImageAnswerObjectMother.Create()));

            //Assert
            ShouldPublishAnswerChangedEvent();
        }

        [TestMethod]
        public void Handler_SingleSelectImageAnswerCreatedEvent_Should_Publish_AnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new SingleSelectImageAnswerCreatedEvent(SingleSelectImageAnswerObjectMother.Create()));

            //Assert
            ShouldPublishAnswerChangedEvent();
        }

        #endregion

        private void ShouldPublishAnswerChangedEvent()
        {
            var calls = _publisher.ReceivedCalls();
            calls.Count().Should().Be(1);
            calls.First().GetArguments()[0].Should().BeOfType<SingleSelectImageAnswerChangedEvent>();
        }
    }
}
