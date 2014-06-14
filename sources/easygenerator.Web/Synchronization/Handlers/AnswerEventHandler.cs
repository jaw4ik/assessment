using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.AnswerEvents;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class AnswerEventHandler : 
        IDomainEventHandler<AnswerCreatedEvent>,
        IDomainEventHandler<AnswerUpdatedEvent>,
        IDomainEventHandler<AnswerDeletedEvent>
    {
        private readonly ICollaborationBroadcaster<Question> _broadcaster;
        private readonly IEntityMapper _mapper;

        public AnswerEventHandler(ICollaborationBroadcaster<Question> broadcaster, IEntityMapper mapper)
        {
            _broadcaster = broadcaster;
            _mapper = mapper;
        }

        public void Handle(AnswerCreatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Answer.Question)
                .answerCreated(args.Answer.Question.Id.ToNString(), _mapper.Map(args.Answer));
        }

        public void Handle(AnswerUpdatedEvent args)
        {
        }

        public void Handle(AnswerDeletedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Question)
               .answerDeleted(args.Question.Id.ToNString(), args.Answer.Id.ToNString());
        }
    }
}