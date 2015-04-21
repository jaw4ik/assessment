using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents.HotSpotEvents;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class HotSpotEventHandler :
        IDomainEventHandler<HotSpotPolygonCreatedEvent>,
        IDomainEventHandler<HotSpotPolygonDeletedEvent>,
        IDomainEventHandler<HotSpotPolygonUpdatedEvent>,
        IDomainEventHandler<HotSpotIsMultipleChangedEvent>
    {
        private readonly ICollaborationBroadcaster<Question> _broadcaster;
        private readonly IEntityMapper _entityMapper;

        public HotSpotEventHandler(ICollaborationBroadcaster<Question> broadcaster, IEntityMapper entityMapper)
        {
            _broadcaster = broadcaster;
            _entityMapper = entityMapper;
        }

        public void Handle(HotSpotPolygonCreatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.HotSpotPolygon.Question)
                .hotSpotPolygonCreated(args.HotSpotPolygon.Question.Id.ToNString(), _entityMapper.Map(args.HotSpotPolygon), args.HotSpotPolygon.Question.ModifiedOn);
        }

        public void Handle(HotSpotPolygonDeletedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Question)
                .hotSpotPolygonDeleted(args.Question.Id.ToNString(), args.HotSpotPolygon.Id.ToNString(), args.Question.ModifiedOn);
        }

        public void Handle(HotSpotPolygonUpdatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.HotSpotPolygon.Question)
                .hotSpotPolygonChanged(args.HotSpotPolygon.Question.Id.ToNString(), _entityMapper.Map(args.HotSpotPolygon), args.HotSpotPolygon.Question.ModifiedOn);
        }

        public void Handle(HotSpotIsMultipleChangedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Question)
                .hotSpotIsMultipleChanged(args.Question.Id.ToNString(), args.IsMultiple, args.Question.ModifiedOn);
        }
        
    }
}