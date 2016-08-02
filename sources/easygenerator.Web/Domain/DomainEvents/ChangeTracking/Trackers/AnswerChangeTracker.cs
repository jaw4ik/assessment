using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.AnswerEvents;
using easygenerator.Web.Domain.DomainEvents.ChangeTracking.Events;

namespace easygenerator.Web.Domain.DomainEvents.ChangeTracking.Trackers
{
    public class AnswerChangeTracker :
        IDomainEventHandler<AnswerCorrectnessUpdatedEvent>,
        IDomainEventHandler<AnswerCreatedEvent>,
        IDomainEventHandler<AnswerTextUpdatedEvent>
    {
        private readonly IDomainEventPublisher _eventPublisher;

        public AnswerChangeTracker(IDomainEventPublisher eventPublisher)
        {
            _eventPublisher = eventPublisher;
        }

        #region Handlers

        public void Handle(AnswerCorrectnessUpdatedEvent args)
        {
            RaiseAnswerChangedEvent(args.Answer);
        }

        public void Handle(AnswerCreatedEvent args)
        {
            RaiseAnswerChangedEvent(args.Answer);
        }

        public void Handle(AnswerTextUpdatedEvent args)
        {
            RaiseAnswerChangedEvent(args.Answer);
        }

        #endregion

        private void RaiseAnswerChangedEvent(Answer answer)
        {
            _eventPublisher.Publish(new AnswerChangedEvent(answer));
        }
    }
}