using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents;
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
    public class QuestionChangeTrackerTests
    {
        private QuestionChangeTracker _tracker;
        private IDomainEventPublisher _publisher;

        [TestInitialize]
        public void Initialize()
        {
            _publisher = Substitute.For<IDomainEventPublisher>();
            _tracker = new QuestionChangeTracker(_publisher);
        }

        #region Question event handlers

        [TestMethod]
        public void Handler_FillInTheBlankUpdated_Should_Publish_QuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new FillInTheBlankUpdatedEvent(FillInTheBlanksObjectMother.Create(), new Collection<BlankAnswer>()));

            //Assert
            ShouldPublishQuestionChangedevent();
        }

        [TestMethod]
        public void Handler_LearningContentsReordered_Should_Publish_QuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new LearningContentsReorderedEvent(FillInTheBlanksObjectMother.Create()));

            //Assert
            ShouldPublishQuestionChangedevent();
        }

        [TestMethod]
        public void Handler_QuestionContentUpdated_Should_Publish_QuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionContentUpdatedEvent(FillInTheBlanksObjectMother.Create()));

            //Assert
            ShouldPublishQuestionChangedevent();
        }

        [TestMethod]
        public void Handler_QuestionBackgroundChanged_Should_Publish_QuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionBackgroundChangedEvent(DragAndDropTextObjectMother.Create(), "bg.com"));

            //Assert
            ShouldPublishQuestionChangedevent();
        }

        [TestMethod]
        public void Handler_QuestionIncorrectFeedbackUpdated_Should_Publish_QuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionIncorrectFeedbackUpdatedEvent(DragAndDropTextObjectMother.Create()));

            //Assert
            ShouldPublishQuestionChangedevent();
        }

        [TestMethod]
        public void Handler_QuestionCorrectFeedbackUpdated_Should_Publish_QuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionCorrectFeedbackUpdatedEvent(DragAndDropTextObjectMother.Create()));

            //Assert
            ShouldPublishQuestionChangedevent();
        }

        [TestMethod]
        public void Handler_QuestionCreated_Should_Publish_QuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionCreatedEvent(DragAndDropTextObjectMother.Create()));

            //Assert
            ShouldPublishQuestionChangedevent();
        }

        [TestMethod]
        public void Handler_QuestionTitleUpdatedEvent_Should_Publish_QuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionTitleUpdatedEvent(DragAndDropTextObjectMother.Create()));

            //Assert
            ShouldPublishQuestionChangedevent();
        }

        #endregion

        private void ShouldPublishQuestionChangedevent()
        {
            var calls = _publisher.ReceivedCalls();
            calls.Count().Should().Be(1);
            calls.First().GetArguments()[0].Should().BeOfType<QuestionChangedEvent>();
        }
    }
}
