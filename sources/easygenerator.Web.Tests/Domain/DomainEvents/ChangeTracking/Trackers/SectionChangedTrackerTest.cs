using easygenerator.DomainModel.Events;
using easygenerator.Web.Domain.DomainEvents.ChangeTracking.Trackers;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Events.QuestionEvents.RankingTextEvents;
using easygenerator.DomainModel.Events.ThemeEvents;
using easygenerator.Infrastructure;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Events.SectionEvents;
using easygenerator.Web.Tests.Domain.DomainEvents.ChangeTracking.Trackers;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Domain.DomainEvents.ChangeTracking.Events;
using easygenerator.Web.Tests.Utils;
using easygenerator.DomainModel.Entities.Questions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.ObjectModel;
using System;
using NSubstitute;

namespace easygenerator.Web.Tests.Domain.DomainEvents.ChangeTracking.Trackers
{
    [TestClass]
    public class SectionChangedTrackerTest
    {
        private SectionChangeTracker _tracker;
        private IDomainEventPublisher _publisher;
        private ISectionRepository _repository;
        private IUnitOfWork _unitOfWork;

        [TestInitialize]
        public void Initialize()
        {
            _publisher = Substitute.For<IDomainEventPublisher>();
            _repository = Substitute.For<ISectionRepository>();
            _unitOfWork = Substitute.For<IUnitOfWork>();
            _tracker = new SectionChangeTracker(_publisher, _repository, _unitOfWork);
        }
        #region Section event handlers

        [TestMethod]
        public void Handle_SectionImageUrlUpdated_ShouldPublishSectionChangedEvent()
        {
            //Act
            _tracker.Handle(new SectionImageUrlUpdatedEvent(SectionObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<SectionChangedEvent>();
        }

        [TestMethod]
        public void Handle_SectionTitleUpdated_ShouldPublishSectionChangedEvent()
        {
            //Act
            _tracker.Handle(new SectionTitleUpdatedEvent(SectionObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<SectionChangedEvent>();
        }

        [TestMethod]
        public void Handle_SectionLearningObjectiveUpdated_ShouldPublishSectionChangedEvent()
        {
            //Act
            _tracker.Handle(new SectionLearningObjectiveUpdatedEvent(SectionObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<SectionChangedEvent>();
        }

        [TestMethod]
        public void Handle_QuestionsReordered_ShouldPublishSectionChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionsReorderedEvent(SectionObjectMother.Create()));

            //Assert
            _publisher.ShouldPublishEvent<SectionChangedEvent>();
        }

        [TestMethod]
        public void Handle_QuestionsDeleted_ShouldPublishSectionChangedEvent()
        {
            //Act
            _tracker.Handle(new QuestionsDeletedEvent(SectionObjectMother.Create(), new Collection<Question>()));

            //Assert
            _publisher.ShouldPublishEvent<SectionChangedEvent>();
        }       

        #endregion

        [TestMethod]
        public void Handle_QuestionChangedEvent_ShouldPublishSectionChangedEvent()
        {
            //Arrange
            var question = FillInTheBlanksObjectMother.Create();
            var section = SectionObjectMother.Create();
            _repository.GetSectionRelatedToQuestion(question.Id).Returns(section);

            //Act
            _tracker.Handle(new QuestionChangedEvent(question));

            //Assert
            _publisher.ShouldPublishEvent<SectionChangedEvent>(1);
        }

        [TestMethod]
        public void Handle_LearningContentChangedEvent_ShouldPublishSectionChangedEvent()
        {
            //Arrange
            var content = LearningContentObjectMother.Create();
            var section = SectionObjectMother.Create();
            _repository.GetSectionRelatedToLearningContent(content.Id).Returns(section);

            //Act
            _tracker.Handle(new LearningContentChangedEvent(content));

            //Assert
            _publisher.ShouldPublishEvent<SectionChangedEvent>(1);
        }

        [TestMethod]
        public void Handle_AnswerChangedEvent_ShouldPublishSectionChangedEvent()
        {
            //Arrange
            var answer = AnswerObjectMother.Create();
            var section = SectionObjectMother.Create();
            _repository.GetSectionRelatedToAnswer(answer.Id).Returns(section);

            //Act
            _tracker.Handle(new AnswerChangedEvent(answer));

            //Assert
            _publisher.ShouldPublishEvent<SectionChangedEvent>(1);
        }

        [TestMethod]
        public void Handle_DropspotChangedEvent_ShouldPublishSectionChangedEvent()
        {
            //Arrange
            var dropspot = DropspotObjectMother.Create();
            var section = SectionObjectMother.Create();
            _repository.GetSectionRelatedToDropspot(dropspot.Id).Returns(section);

            //Act
            _tracker.Handle(new DropspotChangedEvent(dropspot));

            //Assert
            _publisher.ShouldPublishEvent<SectionChangedEvent>(1);
        }

        [TestMethod]
        public void Handle_HotSpotPolygonChangedEvent_ShouldPublishSectionChangedEvent()
        {
            //Arrange
            var polygon = HotSpotPolygonObjectMother.Create();
            var section = SectionObjectMother.Create();
            _repository.GetSectionRelatedToHotSpotPolygon(polygon.Id).Returns(section);

            //Act
            _tracker.Handle(new HotSpotPolygonChangedEvent(polygon));

            //Assert
            _publisher.ShouldPublishEvent<SectionChangedEvent>(1);
        }

        [TestMethod]
        public void Handle_TextMatchingAnswerChanged_ShouldPublishSectionChangedEvent()
        {
            //Arrange
            var answer = TextMatchingAnswerObjectMother.Create();
            var section = SectionObjectMother.Create();
            _repository.GetSectionRelatedToTextMatchingAnswer(answer.Id).Returns(section);

            //Act
            _tracker.Handle(new TextMatchingAnswerChangedEvent(answer));

            //Assert
            _publisher.ShouldPublishEvent<SectionChangedEvent>(1);
        }

        [TestMethod]
        public void Handle_SingleSelectImageAnswerChanged_ShouldPublishSectionChangedEvent()
        {
            //Arrange
            var answer = SingleSelectImageAnswerObjectMother.Create();
            var section = SectionObjectMother.Create();
            _repository.GetSectionRelatedToSingleSelectImageAnswer(answer.Id).Returns(section);

            //Act
            _tracker.Handle(new SingleSelectImageAnswerChangedEvent(answer));

            //Assert
            _publisher.ShouldPublishEvent<SectionChangedEvent>(1);
        }

        [TestMethod]
        public void Handle_RankingTextAnswerTextChanged_ShouldPublishSectionChangedEvent()
        {
            //Arrange
            var answer = RankingTextAnswerObjectMother.Create();
            var section = SectionObjectMother.Create();
            _repository.GetSectionRelatedToRankingTextAnswer(answer.Id).Returns(section);

            //Act
            _tracker.Handle(new RankingTextAnswerTextChangedEvent(answer));

            //Assert
            _publisher.ShouldPublishEvent<SectionChangedEvent>(1);
        }

        [TestMethod]
        public void Handle_RankingTextAnswerCreated_ShouldPublishSectionChangedEvent()
        {
            //Arrange
            var answer = RankingTextAnswerObjectMother.Create();
            var section = SectionObjectMother.Create();
            _repository.GetSectionRelatedToRankingTextAnswer(answer.Id).Returns(section);

            //Act
            _tracker.Handle(new RankingTextAnswerCreatedEvent(answer));

            //Assert
            _publisher.ShouldPublishEvent<SectionChangedEvent>(1);
        }

        [TestMethod]
        public void Handle_QuestionChangedEvent_ShouldCallSaveMethod()
        {
            //Arrange
            var question = FillInTheBlanksObjectMother.Create();
            var section = SectionObjectMother.Create();
            _repository.GetSectionRelatedToQuestion(question.Id).Returns(section);

            //Act
            _tracker.Handle(new QuestionChangedEvent(question));

            //Assert
            _unitOfWork.Received().Save();
        }

        [TestMethod]
        public void Handle_LearningContentChangedEvent_ShouldCallSaveMethod()
        {
            //Arrange
            var content = LearningContentObjectMother.Create();
            var section = SectionObjectMother.Create();
            _repository.GetSectionRelatedToLearningContent(content.Id).Returns(section);

            //Act
            _tracker.Handle(new LearningContentChangedEvent(content));

            //Assert
            _unitOfWork.Received().Save();
        }

        [TestMethod]
        public void Handle_AnswerChangedEvent_ShouldCallSaveMethod()
        {
            //Arrange
            var answer = AnswerObjectMother.Create();
            var section = SectionObjectMother.Create();
            _repository.GetSectionRelatedToAnswer(answer.Id).Returns(section);

            //Act
            _tracker.Handle(new AnswerChangedEvent(answer));

            //Assert
            _unitOfWork.Received().Save();
        }

        [TestMethod]
        public void Handle_DropspotChangedEvent_ShouldCallSaveMethod()
        {
            //Arrange
            var dropspot = DropspotObjectMother.Create();
            var section = SectionObjectMother.Create();
            _repository.GetSectionRelatedToDropspot(dropspot.Id).Returns(section);

            //Act
            _tracker.Handle(new DropspotChangedEvent(dropspot));

            //Assert
            _unitOfWork.Received().Save();
        }

        [TestMethod]
        public void Handle_HotSpotPolygonChangedEvent_ShouldCallSaveMethod()
        {
            //Arrange
            var polygon = HotSpotPolygonObjectMother.Create();
            var section = SectionObjectMother.Create();
            _repository.GetSectionRelatedToHotSpotPolygon(polygon.Id).Returns(section);

            //Act
            _tracker.Handle(new HotSpotPolygonChangedEvent(polygon));

            //Assert
            _unitOfWork.Received().Save();
        }

        [TestMethod]
        public void Handle_TextMatchingAnswerChanged_ShouldCallSaveMethod()
        {
            //Arrange
            var answer = TextMatchingAnswerObjectMother.Create();
            var section = SectionObjectMother.Create();
            _repository.GetSectionRelatedToTextMatchingAnswer(answer.Id).Returns(section);

            //Act
            _tracker.Handle(new TextMatchingAnswerChangedEvent(answer));

            //Assert
            _unitOfWork.Received().Save();
        }

        [TestMethod]
        public void Handle_SingleSelectImageAnswerChanged_ShouldCallSaveMethod()
        {
            //Arrange
            var answer = SingleSelectImageAnswerObjectMother.Create();
            var section = SectionObjectMother.Create();
            _repository.GetSectionRelatedToSingleSelectImageAnswer(answer.Id).Returns(section);

            //Act
            _tracker.Handle(new SingleSelectImageAnswerChangedEvent(answer));

            //Assert
            _unitOfWork.Received().Save();
        }

        [TestMethod]
        public void Handle_RankingTextAnswerTextChanged_ShouldCallSaveMethod()
        {
            //Arrange
            var answer = RankingTextAnswerObjectMother.Create();
            var section = SectionObjectMother.Create();
            _repository.GetSectionRelatedToRankingTextAnswer(answer.Id).Returns(section);

            //Act
            _tracker.Handle(new RankingTextAnswerTextChangedEvent(answer));

            //Assert
            _unitOfWork.Received().Save();
        }

        [TestMethod]
        public void Handle_RankingTextAnswerCreated_ShouldCallSaveMethod()
        {
            //Arrange
            var answer = RankingTextAnswerObjectMother.Create();
            var section = SectionObjectMother.Create();
            _repository.GetSectionRelatedToRankingTextAnswer(answer.Id).Returns(section);

            //Act
            _tracker.Handle(new RankingTextAnswerCreatedEvent(answer));

            //Assert
            _unitOfWork.Received().Save();
        }
    }
}
