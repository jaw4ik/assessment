using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.LearningContentEvents;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class LearningContentEventHandler :
        IDomainEventHandler<LearningContentCreatedEvent>,
        IDomainEventHandler<LearningContentUpdatedEvent>,
        IDomainEventHandler<LearningContentDeletedEvent>
    {
        private readonly ICollaborationBroadcaster<Question> _broadcaster;
        private readonly IEntityMapper _entityMapper;

        public LearningContentEventHandler(ICollaborationBroadcaster<Question> broadcaster, IEntityMapper entityMapper)
        {
            _broadcaster = broadcaster;
            _entityMapper = entityMapper;
        }

        public void Handle(LearningContentCreatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.LearningContent.Question)
                .learningContentCreated(args.LearningContent.Question.Id.ToNString(), _entityMapper.Map(args.LearningContent), args.LearningContent.ModifiedOn);
        }

        public void Handle(LearningContentUpdatedEvent args)
        {
            _broadcaster.OtherCollaborators(args.LearningContent.Question)
                .learningContentUpdated(args.LearningContent.Question.Id.ToNString(), _entityMapper.Map(args.LearningContent), args.LearningContent.ModifiedOn);
        }

        public void Handle(LearningContentDeletedEvent args)
        {
            _broadcaster.OtherCollaborators(args.Question)
                .learningContentDeleted(args.Question.Id.ToNString(), args.LearningContent.Id.ToNString(), args.Question.ModifiedOn);
        }
    }
}