using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class QuestionEventHandler : IDomainEventHandler<QuestionCreatedEvent>
    {
        private readonly ICollaborationBroadcaster<Objective> _broadcaster;
        private readonly IEntityMapper _entityMapper;

        public QuestionEventHandler(ICollaborationBroadcaster<Objective> broadcaster, IEntityMapper entityMapper)
        {
            _broadcaster = broadcaster;
            _entityMapper = entityMapper;
        }

        public void Handle(QuestionCreatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Question.Objective)
                    .questionCreated(args.Question.Objective.Id.ToNString(), _entityMapper.Map(args.Question), args.Question.Objective.ModifiedOn);
        }
    }
}