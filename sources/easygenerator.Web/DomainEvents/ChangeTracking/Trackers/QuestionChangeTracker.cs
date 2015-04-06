using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.Web.DomainEvents.ChangeTracking.Events;

namespace easygenerator.Web.DomainEvents.ChangeTracking.Trackers
{
    public class QuestionChangeTracker :
        IDomainEventHandler<FillInTheBlankUpdatedEvent>,
        IDomainEventHandler<LearningContentsReorderedEvent>,
        IDomainEventHandler<QuestionBackgroundChangedEvent>,
        IDomainEventHandler<QuestionContentUpdatedEvent>,
        IDomainEventHandler<QuestionCorrectFeedbackUpdatedEvent>,
        IDomainEventHandler<QuestionCreatedEvent>,
        IDomainEventHandler<QuestionIncorrectFeedbackUpdatedEvent>,
        IDomainEventHandler<QuestionTitleUpdatedEvent>
    {
        private readonly IDomainEventPublisher _eventPublisher;

        public QuestionChangeTracker(IDomainEventPublisher eventPublisher)
        {
            _eventPublisher = eventPublisher;
        }

        #region Handlers

        public void Handle(FillInTheBlankUpdatedEvent args)
        {
            RaiseQuestionChangedEvent(args.Question);
        }

        public void Handle(LearningContentsReorderedEvent args)
        {
            RaiseQuestionChangedEvent(args.Question);
        }

        public void Handle(QuestionBackgroundChangedEvent args)
        {
            RaiseQuestionChangedEvent(args.Question);
        }

        public void Handle(QuestionContentUpdatedEvent args)
        {
            RaiseQuestionChangedEvent(args.Question);
        }

        public void Handle(QuestionCorrectFeedbackUpdatedEvent args)
        {
            RaiseQuestionChangedEvent(args.Question);
        }

        public void Handle(QuestionCreatedEvent args)
        {
            RaiseQuestionChangedEvent(args.Question);
        }

        public void Handle(QuestionIncorrectFeedbackUpdatedEvent args)
        {
            RaiseQuestionChangedEvent(args.Question);
        }

        public void Handle(QuestionTitleUpdatedEvent args)
        {
            RaiseQuestionChangedEvent(args.Question);
        }

        #endregion

        private void RaiseQuestionChangedEvent(Question question)
        {
            _eventPublisher.Publish(new QuestionChangedEvent(question));
        }
    }
}