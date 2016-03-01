using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.SectionEvents;
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
    public class SectionChangeTrackerTests
    {
        private SectionChangeTracker _tracker;
        private IDomainEventPublisher _publisher;

        [TestInitialize]
        public void Initialize()
        {
            _publisher = Substitute.For<IDomainEventPublisher>();
            _tracker = new SectionChangeTracker(_publisher);
        }

        #region Section event handlers

        [TestMethod]
        public void Handler_SectionImageUrlUpdated_Should_Publish_SectionChangedEvent()
        {
            //Act
            _tracker.Handle(new SectionImageUrlUpdatedEvent(SectionObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<SectionChangedEvent>();
        }

        [TestMethod]
        public void Handler_SectionTitleUpdated_Should_Publish_SectionChangedEvent()
        {
            //Act
            _tracker.Handle(new SectionTitleUpdatedEvent(SectionObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<SectionChangedEvent>();
        }

        [TestMethod]
        public void Handler_SectionLearningObjectiveUpdated_Should_Publish_SectionChangedEvent()
        {
            //Act
            _tracker.Handle(new SectionLearningObjectiveUpdatedEvent(SectionObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<SectionChangedEvent>();
        }

        [TestMethod]
        public void Handler_QuestionsReordered_Should_Publish_SectionChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionsReorderedEvent(SectionObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<SectionChangedEvent>();
        }

        [TestMethod]
        public void Handler_QuestionsDeleted_Should_Publish_SectionChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionsDeletedEvent(SectionObjectMother.Create(), new Collection<Question>()));

            //Assert
            _publisher.ShouldPublishEvent<SectionChangedEvent>();
        }

        #endregion
    }
}
