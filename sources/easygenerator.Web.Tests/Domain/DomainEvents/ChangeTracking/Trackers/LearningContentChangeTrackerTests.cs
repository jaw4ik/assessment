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
        public void Handle_LearningContentCreated_ShouldPublishLearningContentChangedEvent()
        {
            //Act
            _tracker.Handle(new LearningContentCreatedEvent(LearningContentObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<LearningContentChangedEvent>();
        }

        [TestMethod]
        public void Handle_LearningContentUpdated_ShouldPublishLearningContentChangedEvent()
        {
            //Act
            _tracker.Handle(new LearningContentUpdatedEvent(LearningContentObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<LearningContentChangedEvent>();
        }

        #endregion
    }
}
