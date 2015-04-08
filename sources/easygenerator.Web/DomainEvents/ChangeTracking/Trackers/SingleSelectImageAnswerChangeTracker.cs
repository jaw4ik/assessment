using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents.SingleSelectImageEvents;
using easygenerator.Web.DomainEvents.ChangeTracking.Events;

namespace easygenerator.Web.DomainEvents.ChangeTracking.Trackers
{
    public class SingleSelectImageAnswerChangeTracker :
        IDomainEventHandler<SingleSelectImageAnswerCreatedEvent>,
        IDomainEventHandler<SingleSelectImageAnswerImageUpdatedEvent>,
        IDomainEventHandler<SingleSelectImageCorrectAnswerChangedEvent>
    {
        private readonly IDomainEventPublisher _eventPublisher;

        public SingleSelectImageAnswerChangeTracker(IDomainEventPublisher eventPublisher)
        {
            _eventPublisher = eventPublisher;
        }

        #region Handlers

        public void Handle(SingleSelectImageCorrectAnswerChangedEvent args)
        {
            RaiseAnswerChangedEvent(args.Answer);
        }

        public void Handle(SingleSelectImageAnswerImageUpdatedEvent args)
        {
            RaiseAnswerChangedEvent(args.Answer);
        }

        public void Handle(SingleSelectImageAnswerCreatedEvent args)
        {
            RaiseAnswerChangedEvent(args.Answer);
        }

        #endregion

        private void RaiseAnswerChangedEvent(SingleSelectImageAnswer answer)
        {
            _eventPublisher.Publish(new SingleSelectImageAnswerChangedEvent(answer));
        }
    }
}