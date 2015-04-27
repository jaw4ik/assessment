using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.DomainModel.Events.QuestionEvents.DragAndDropEvents;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class DragAndDropEventHandler :
        IDomainEventHandler<DropspotCreatedEvent>,
        IDomainEventHandler<DropspotDeletedEvent>,
        IDomainEventHandler<DropspotTextChangedEvent>,
        IDomainEventHandler<DropspotPositionChangedEvent>
    {
        private readonly ICollaborationBroadcaster<Question> _broadcaster;
        private readonly IEntityMapper _entityMapper;

        public DragAndDropEventHandler(ICollaborationBroadcaster<Question> broadcaster, IEntityMapper entityMapper)
        {
            _broadcaster = broadcaster;
            _entityMapper = entityMapper;
        }
      
        public void Handle(DropspotCreatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Dropspot.Question)
                .dragAndDropDropspotCreated(args.Dropspot.Question.Id.ToNString(), _entityMapper.Map(args.Dropspot), args.Dropspot.Question.ModifiedOn);
        }

        public void Handle(DropspotDeletedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Question)
                .dragAndDropDropspotDeleted(args.Question.Id.ToNString(), args.Dropspot.Id.ToNString(), args.Question.ModifiedOn);
        }

        public void Handle(DropspotTextChangedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Dropspot.Question)
                .dragAndDropDropspotTextChanged(args.Dropspot.Question.Id.ToNString(), _entityMapper.Map(args.Dropspot), args.Dropspot.Question.ModifiedOn);
        }

        public void Handle(DropspotPositionChangedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Dropspot.Question)
                 .dragAndDropDropspotPositionChanged(args.Dropspot.Question.Id.ToNString(), _entityMapper.Map(args.Dropspot), args.Dropspot.Question.ModifiedOn);
        }
    }
}