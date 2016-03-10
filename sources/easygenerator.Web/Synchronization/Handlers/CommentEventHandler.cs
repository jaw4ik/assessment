using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CommentEvents;
using easygenerator.DomainModel.Events.LearningContentEvents;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class CommentEventHandler :
        IDomainEventHandler<CommentDeletedEvent>,
        IDomainEventHandler<CommentCreatedEvent>
    {
        private readonly ICollaborationBroadcaster<Course> _broadcaster;
        private readonly IEntityMapper _entityMapper;

        public CommentEventHandler(ICollaborationBroadcaster<Course> broadcaster, IEntityMapper entityMapper)
        {
            _broadcaster = broadcaster;
            _entityMapper = entityMapper;
        }

        public void Handle(CommentDeletedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Course)
                .commentDeleted(args.Course.Id.ToNString(), args.Comment.Id.ToNString());
        }

        public void Handle(CommentCreatedEvent args)
        {
            _broadcaster.AllCollaborators(args.Course)
                .commentCreated(args.Course.Id.ToNString(), _entityMapper.Map(args.Comment));
        }
    }
}