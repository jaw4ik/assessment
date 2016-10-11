using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.AnswerEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Domain.DomainEvents.ChangeTracking.Events;
using easygenerator.Web.Domain.DomainEvents.ChangeTracking.Trackers;
using easygenerator.Web.Tests.Utils;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Domain.DomainEvents.ChangeTracking.Trackers
{
    [TestClass]
    public class AnswerChangeTrackerTests
    {
        private AnswerChangeTracker _tracker;
        private IDomainEventPublisher _publisher;

        [TestInitialize]
        public void Initialize()
        {
            _publisher = Substitute.For<IDomainEventPublisher>();
            _tracker = new AnswerChangeTracker(_publisher);
        }

        #region Handlers

        [TestMethod]
        public void Handle_AnswerCorrectnessUpdated_ShouldPublishAnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new AnswerCorrectnessUpdatedEvent(AnswerObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<AnswerChangedEvent>();
        }

        [TestMethod]
        public void Handle_AnswerCreated_ShouldPublishAnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new AnswerCreatedEvent(AnswerObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<AnswerChangedEvent>();
        }

        [TestMethod]
        public void Handle_AnswerTextUpdated_ShouldPublishAnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new AnswerTextUpdatedEvent(AnswerObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<AnswerChangedEvent>();
        }

        #endregion
    }
}
