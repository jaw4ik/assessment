using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents.SingleSelectImageEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Domain.DomainEvents.ChangeTracking.Events;
using easygenerator.Web.Domain.DomainEvents.ChangeTracking.Trackers;
using easygenerator.Web.Tests.Utils;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Domain.DomainEvents.ChangeTracking.Trackers
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
        public void Handle_SingleSelectImageCorrectAnswerChangedEvent_ShouldPublishAnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new SingleSelectImageCorrectAnswerChangedEvent(SingleSelectImageAnswerObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<SingleSelectImageAnswerChangedEvent>();
        }

        [TestMethod]
        public void Handle_SingleSelectImageAnswerImageUpdatedEvent_ShouldPublishAnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new SingleSelectImageAnswerImageUpdatedEvent(SingleSelectImageAnswerObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<SingleSelectImageAnswerChangedEvent>();
        }

        [TestMethod]
        public void Handle_SingleSelectImageAnswerCreatedEvent_ShouldPublishAnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new SingleSelectImageAnswerCreatedEvent(SingleSelectImageAnswerObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<SingleSelectImageAnswerChangedEvent>();
        }

        #endregion
    }
}
