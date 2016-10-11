using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents.TextMatchingEvents;
using easygenerator.Web.Domain.DomainEvents.ChangeTracking.Events;

namespace easygenerator.Web.Domain.DomainEvents.ChangeTracking.Trackers
{
    public class TextMatchingAnswerChangeTracker :
        IDomainEventHandler<TextMatchingAnswerCreatedEvent>,
        IDomainEventHandler<TextMatchingAnswerKeyChangedEvent>,
        IDomainEventHandler<TextMatchingAnswerValueChangedEvent>
    {
        private readonly IDomainEventPublisher _eventPublisher;

        public TextMatchingAnswerChangeTracker(IDomainEventPublisher eventPublisher)
        {
            _eventPublisher = eventPublisher;
        }

        #region Handlers

        public void Handle(TextMatchingAnswerValueChangedEvent args)
        {
            RaiseAnswerChangedEvent(args.Answer);
        }

        public void Handle(TextMatchingAnswerKeyChangedEvent args)
        {
            RaiseAnswerChangedEvent(args.Answer);
        }

        public void Handle(TextMatchingAnswerCreatedEvent args)
        {
            RaiseAnswerChangedEvent(args.Answer);
        }

        #endregion

        private void RaiseAnswerChangedEvent(TextMatchingAnswer answer)
        {
            _eventPublisher.Publish(new TextMatchingAnswerChangedEvent(answer));
        }

    }
}