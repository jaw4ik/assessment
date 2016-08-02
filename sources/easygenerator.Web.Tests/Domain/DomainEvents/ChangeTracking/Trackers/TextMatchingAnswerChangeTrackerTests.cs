using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents.TextMatchingEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Domain.DomainEvents.ChangeTracking.Events;
using easygenerator.Web.Domain.DomainEvents.ChangeTracking.Trackers;
using easygenerator.Web.Tests.Utils;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Domain.DomainEvents.ChangeTracking.Trackers
{
    [TestClass]
    public class TextMatchingAnswerChangeTrackerTests
    {
        private TextMatchingAnswerChangeTracker _tracker;
        private IDomainEventPublisher _publisher;

        [TestInitialize]
        public void Initialize()
        {
            _publisher = Substitute.For<IDomainEventPublisher>();
            _tracker = new TextMatchingAnswerChangeTracker(_publisher);
        }

        #region Handlers

        [TestMethod]
        public void Handler_TextMatchingAnswerValueChanged_Should_Publish_AnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new TextMatchingAnswerValueChangedEvent(TextMatchingAnswerObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<TextMatchingAnswerChangedEvent>();
        }

        [TestMethod]
        public void Handler_TextMatchingAnswerKeyChangedEvent_Should_Publish_AnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new TextMatchingAnswerKeyChangedEvent(TextMatchingAnswerObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<TextMatchingAnswerChangedEvent>();
        }

        [TestMethod]
        public void Handler_TextMatchingAnswerCreatedEvent_Should_Publish_AnswerChangedEvent()
        {
            //Act
            _tracker.Handle(new TextMatchingAnswerCreatedEvent(TextMatchingAnswerObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<TextMatchingAnswerChangedEvent>();
        }

        #endregion
    }
}
