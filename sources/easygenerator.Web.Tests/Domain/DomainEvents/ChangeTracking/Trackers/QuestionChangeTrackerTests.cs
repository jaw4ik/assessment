﻿using System.Collections.ObjectModel;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.AnswerEvents;
using easygenerator.DomainModel.Events.LearningContentEvents;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.DomainModel.Events.QuestionEvents.DragAndDropEvents;
using easygenerator.DomainModel.Events.QuestionEvents.HotSpotEvents;
using easygenerator.DomainModel.Events.QuestionEvents.RankingTextEvents;
using easygenerator.DomainModel.Events.QuestionEvents.ScenarioEvents;
using easygenerator.DomainModel.Events.QuestionEvents.SingleSelectImageEvents;
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
        public void Handle_FillInTheBlankUpdated_ShouldPublishQuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new FillInTheBlankUpdatedEvent(FillInTheBlanksObjectMother.Create(), new Collection<BlankAnswer>()));

            //Assert
            _publisher.ShouldPublishEvent<QuestionChangedEvent>();
        }

        [TestMethod]
        public void Handle_QuestionContentUpdated_ShouldPublishQuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionContentUpdatedEvent(FillInTheBlanksObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<QuestionChangedEvent>();
        }

        [TestMethod]
        public void Handle_QuestionBackgroundChanged_ShouldPublishQuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionBackgroundChangedEvent(DragAndDropTextObjectMother.Create(), "bg.com"));

            //Assert
            _publisher.ShouldPublishEvent<QuestionChangedEvent>();
        }

        [TestMethod]
        public void Handle_QuestionIncorrectFeedbackUpdated_ShouldPublishQuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionIncorrectFeedbackUpdatedEvent(DragAndDropTextObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<QuestionChangedEvent>();
        }

        [TestMethod]
        public void Handle_QuestionCorrectFeedbackUpdated_ShouldPublishQuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionCorrectFeedbackUpdatedEvent(DragAndDropTextObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<QuestionChangedEvent>();
        }

        [TestMethod]
        public void Handle_QuestionCreated_ShouldPublishQuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionCreatedEvent(DragAndDropTextObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<QuestionChangedEvent>();
        }

        [TestMethod]
        public void Handle_QuestionTitleUpdatedEvent_ShouldPublishQuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionTitleUpdatedEvent(DragAndDropTextObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<QuestionChangedEvent>();
        }

        [TestMethod]
        public void Handle_QuestionVoiceOverUpdatedEvent_ShouldPublishQuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionVoiceOverUpdatedEvent(DragAndDropTextObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<QuestionChangedEvent>();
        }

        [TestMethod]
        public void Handle_AnswerDeletedEvent_ShouldPublishQuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new AnswerDeletedEvent(SingleSelectTextObjectMother.Create(), AnswerObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<QuestionChangedEvent>();
        }

        [TestMethod]
        public void Handle_LearningContentDeletedEvent_ShouldPublishQuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new LearningContentDeletedEvent(SingleSelectTextObjectMother.Create(), LearningContentObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<QuestionChangedEvent>();
        }

        [TestMethod]
        public void Handle_HotSpotPolygonDeletedEvent_ShouldPublishQuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new HotSpotPolygonDeletedEvent(SingleSelectTextObjectMother.Create(), HotSpotPolygonObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<QuestionChangedEvent>();
        }

        [TestMethod]
        public void Handle_DropspotPolygonDeletedEvent_ShouldPublishQuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new DropspotDeletedEvent(SingleSelectTextObjectMother.Create(), DropspotObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<QuestionChangedEvent>();
        }

        [TestMethod]
        public void Handle_HotSpotIsMultipleChanged_ShouldPublishQuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new HotSpotIsMultipleChangedEvent(SingleSelectTextObjectMother.Create(), false));

            //Assert
            _publisher.ShouldPublishEvent<QuestionChangedEvent>();
        }

        [TestMethod]
        public void Handle_TextMatchingAnswerDeleted_ShouldPublishQuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new TextMatchingAnswerDeletedEvent(TextMatchingObjectMother.Create(), TextMatchingAnswerObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<QuestionChangedEvent>();
        }

        [TestMethod]
        public void Handle_SingleSelectImageAnswerDeleted_ShouldPublishQuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new SingleSelectImageAnswerDeletedEvent(SingleSelectImageAnswerObjectMother.Create(), SingleSelectImageObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<QuestionChangedEvent>();
        }

        [TestMethod]
        public void Handle_ScenarioDataUpdatedEvent_ShouldPublishQuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new ScenarioDataUpdatedEvent(ScenarioObjectMother.Create(), null, null, null, null));

            //Assert
            _publisher.ShouldPublishEvent<QuestionChangedEvent>();
        }

        [TestMethod]
        public void Handle_ScenarioMasteryScoreUpdatedEvent_ShouldPublishQuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new ScenarioMasteryScoreUpdatedEvent(ScenarioObjectMother.Create(), 100));

            //Assert
            _publisher.ShouldPublishEvent<QuestionChangedEvent>();
        }

        [TestMethod]
        public void Handle_RankingTextAnswerDeletedEvent_ShouldPublishQuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new RankingTextAnswerDeletedEvent(RankingTextObjectMother.Create(), RankingTextAnswerObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<QuestionChangedEvent>();
        }

        [TestMethod]
        public void Handle_RankingTextAnswersReorderedEvent_ShouldPublishQuestionChangedEvent()
        {
            //Act
            _tracker.Handle(new RankingTextAnswersReorderedEvent(RankingTextObjectMother.Create(), new Collection<RankingTextAnswer>()));

            //Assert
            _publisher.ShouldPublishEvent<QuestionChangedEvent>();
        }
        
        #endregion
    }
}
