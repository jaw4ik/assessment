using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.ObjectiveEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.DomainEvents.ChangeTracking.Events;
using easygenerator.Web.DomainEvents.ChangeTracking.Trackers;
using easygenerator.Web.Tests.Utils;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Collections.ObjectModel;

namespace easygenerator.Web.Tests.DomainEvents.ChangeTracking.Trackers
{
    [TestClass]
    public class ObjectiveChangeTrackerTests
    {
        private ObjectiveChangeTracker _tracker;
        private IDomainEventPublisher _publisher;

        [TestInitialize]
        public void Initialize()
        {
            _publisher = Substitute.For<IDomainEventPublisher>();
            _tracker = new ObjectiveChangeTracker(_publisher);
        }

        #region Objective event handlers

        [TestMethod]
        public void Handler_ObjectiveImageUrlUpdated_Should_Publish_ObjectiveChangedEvent()
        {
            //Act
            _tracker.Handle(new ObjectiveImageUrlUpdatedEvent(ObjectiveObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<ObjectiveChangedEvent>();
        }

        [TestMethod]
        public void Handler_ObjectiveTitleUpdated_Should_Publish_ObjectiveChangedEvent()
        {
            //Act
            _tracker.Handle(new ObjectiveTitleUpdatedEvent(ObjectiveObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<ObjectiveChangedEvent>();
        }

        [TestMethod]
        public void Handler_ObjectiveLearningObjectiveUpdated_Should_Publish_ObjectiveChangedEvent()
        {
            //Act
            _tracker.Handle(new ObjectiveLearningObjectiveUpdatedEvent(ObjectiveObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<ObjectiveChangedEvent>();
        }

        [TestMethod]
        public void Handler_QuestionsReordered_Should_Publish_ObjectiveChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionsReorderedEvent(ObjectiveObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<ObjectiveChangedEvent>();
        }

        [TestMethod]
        public void Handler_QuestionsDeleted_Should_Publish_ObjectiveChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionsDeletedEvent(ObjectiveObjectMother.Create(), new Collection<Question>()));

            //Assert
            _publisher.ShouldPublishEvent<ObjectiveChangedEvent>();
        }

        #endregion
    }
}
