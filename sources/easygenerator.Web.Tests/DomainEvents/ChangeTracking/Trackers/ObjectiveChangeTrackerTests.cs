using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.ObjectiveEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.DomainEvents.ChangeTracking.Events;
using easygenerator.Web.DomainEvents.ChangeTracking.Trackers;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Collections.ObjectModel;
using System.Linq;

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
            ShouldPublishObjectiveChangedevent();
        }

        [TestMethod]
        public void Handler_ObjectiveTitleUpdated_Should_Publish_ObjectiveChangedEvent()
        {
            //Act
            _tracker.Handle(new ObjectiveTitleUpdatedEvent(ObjectiveObjectMother.Create()));

            //Assert
            ShouldPublishObjectiveChangedevent();
        }

        [TestMethod]
        public void Handler_QuestionsReordered_Should_Publish_ObjectiveChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionsReorderedEvent(ObjectiveObjectMother.Create()));

            //Assert
            ShouldPublishObjectiveChangedevent();
        }

        [TestMethod]
        public void Handler_QuestionsDeleted_Should_Publish_ObjectiveChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionsDeletedEvent(ObjectiveObjectMother.Create(), new Collection<Question>()));

            //Assert
            ShouldPublishObjectiveChangedevent();
        }

        #endregion

        private void ShouldPublishObjectiveChangedevent()
        {
            var calls = _publisher.ReceivedCalls();
            calls.Count().Should().Be(1);
            calls.First().GetArguments()[0].Should().BeOfType<ObjectiveChangedEvent>();
        }
    }
}
