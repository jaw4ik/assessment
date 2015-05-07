using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents.SingleSelectImageEvents;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class SingleSelectImageEventHandler :
        IDomainEventHandler<SingleSelectImageAnswerCreatedEvent>,
        IDomainEventHandler<SingleSelectImageAnswerDeletedEvent>,
        IDomainEventHandler<SingleSelectImageAnswerImageUpdatedEvent>,
        IDomainEventHandler<SingleSelectImageCorrectAnswerChangedEvent>
    {
        private readonly ICollaborationBroadcaster<Question> _broadcaster;
        private readonly IEntityMapper _entityMapper;

        public SingleSelectImageEventHandler(ICollaborationBroadcaster<Question> broadcaster, IEntityMapper entityMapper)
        {
            _broadcaster = broadcaster;
            _entityMapper = entityMapper;
        }

        public void Handle(SingleSelectImageAnswerCreatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Answer.Question)
              .singleSelectImageAnswerCreated(args.Answer.Question.Id.ToNString(), _entityMapper.Map(args.Answer), args.Answer.Question.ModifiedOn);
        }

        public void Handle(SingleSelectImageAnswerDeletedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Question)
             .singleSelectImageAnswerDeleted(args.Question.Id.ToNString(), args.Answer.Id.ToNString(),
             args.Question.CorrectAnswer == null ? null : args.Question.CorrectAnswer.Id.ToNString(),
             args.Question.ModifiedOn);
        }

        public void Handle(SingleSelectImageAnswerImageUpdatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Answer.Question)
             .singleSelectImageAnswerImageUpdated(args.Answer.Question.Id.ToNString(), _entityMapper.Map(args.Answer), args.Answer.Question.ModifiedOn);
        }

        public void Handle(SingleSelectImageCorrectAnswerChangedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Answer.Question)
            .singleSelectImageCorrectAnswerChanged(args.Answer.Question.Id.ToNString(), args.Answer.Id.ToNString(), args.Answer.Question.ModifiedOn);
        }
    }
}