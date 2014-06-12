using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class QuestionEventHandler :
        IDomainEventHandler<QuestionCreatedEvent>,
        IDomainEventHandler<QuestionTitleUpdatedEvent>,
        IDomainEventHandler<QuestionContentUpdatedEvent>
    {
        private readonly ICollaborationBroadcaster<Question> _broadcaster;
        private readonly IEntityMapper _entityMapper;

        public QuestionEventHandler(ICollaborationBroadcaster<Question> broadcaster, IEntityMapper entityMapper)
        {
            _broadcaster = broadcaster;
            _entityMapper = entityMapper;
        }

        public void Handle(QuestionCreatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Question)
                .questionCreated(args.Question.Objective.Id.ToNString(), _entityMapper.Map(args.Question), args.Question.Objective.ModifiedOn);
        }

        public void Handle(QuestionContentUpdatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Question)
                .questionContentUpdated(args.Question.Id.ToNString(), args.Question.Content, args.Question.ModifiedOn);
        }

        public void Handle(QuestionTitleUpdatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Question)
                .questionTitleUpdated(args.Question.Id.ToNString(), args.Question.Title, args.Question.ModifiedOn);
        }
    }
}