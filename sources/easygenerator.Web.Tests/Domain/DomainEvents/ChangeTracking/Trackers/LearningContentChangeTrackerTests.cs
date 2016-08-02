using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.LearningContentEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Domain.DomainEvents.ChangeTracking.Events;
using easygenerator.Web.Domain.DomainEvents.ChangeTracking.Trackers;
using easygenerator.Web.Tests.Utils;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Domain.DomainEvents.ChangeTracking.Trackers
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
            _publisher.ShouldPublishEvent<LearningContentChangedEvent>();
        }

        [TestMethod]
        public void Handler_LearningContentUpdated_Should_Publish_LearningContentChangedEvent()
        {
            //Act
            _tracker.Handle(new LearningContentUpdatedEvent(LearningContentObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<LearningContentChangedEvent>();
        }

        #endregion
    }
}
